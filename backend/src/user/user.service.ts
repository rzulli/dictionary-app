import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteWordDto } from './dto/favorite-word.dto';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { NotFoundError } from 'rxjs';
import { UserHistory } from './entities/userHistory.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserHistory)
    private userHistoryRepository: Repository<UserHistory>,
    @InjectRepository(Dictionary)
    private entryRepository: Repository<Dictionary>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.password = createUserDto.password;
    this.logger.log(JSON.stringify(user));
    return new Promise<User>((resolve, reject) => {
      this.userRepository
        .save(user)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          //23505 - code para quando unique check for quebrado
          //TODO - melhorar handling de erro. hardcode
          if (error.code == 23505) {
            this.logger.debug('E-mail duplicado');
            reject(new HttpException('E-mail duplicado.', 400));
          } else {
            this.logger.debug(JSON.stringify(error));
          }
          reject(new HttpException(error.message, 400));
        });
    });
  }

  async unfavoriteWord(favoriteWordDto: FavoriteWordDto): Promise<boolean> {
    if (favoriteWordDto.userId == undefined) {
      throw new NotFoundException('Usuário não encontrado');
    }
    this.logger.debug(`Unfavoritando ${JSON.stringify(favoriteWordDto)}`);
    const user = await this.userRepository.findOne({
      where: { id: favoriteWordDto.userId },
      relations: ['favorites'],
    });

    if (user == null) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user) {
      user.favorites = user.favorites.filter((entry) => {
        return entry.word !== favoriteWordDto.word;
      });

      await this.userRepository.save(user);
      this.logger.debug(
        `Palavra favorita  ${favoriteWordDto.word} removida a usuário ${favoriteWordDto.userId} `,
      );
      return true;
    }

    return false;
  }

  async favoriteWord(favoriteWordDto: FavoriteWordDto): Promise<boolean> {
    if (favoriteWordDto.userId == undefined) {
      throw new NotFoundException('Usuário não encontrado');
    }
    this.logger.debug(`Removendo favorito ${JSON.stringify(favoriteWordDto)}`);
    const user = await this.userRepository.findOne({
      where: { id: favoriteWordDto.userId },
      relations: ['favorites'],
    });
    const entry = await this.entryRepository.findOne({
      where: { word: favoriteWordDto.word },
    });
    if (user == null) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (entry == null) {
      throw new NotFoundException('Palavra não encontrada');
    }
    if (user && entry) {
      user.favorites.push(entry);
      await this.userRepository.save(user);
      this.logger.debug(
        `Palavra favorita ${favoriteWordDto.word} adicionada a usuário ${favoriteWordDto.userId} `,
      );
      return true;
    }

    return false;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findByIdIncludeRelations(
    id: number,
    realtions: string[],
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: realtions,
    });
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update({ email }, updateUserDto);
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getProfile(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .leftJoinAndSelect('user.history', 'history')
      .leftJoin('user.favorites', 'favorite')
      .select(['user'])
      .addSelect(['favorite.word', 'history'])
      .getOne();

    this.logger.log(JSON.stringify(user));
    return user;
  }
  async getHistory(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.history', 'history')
      .where('user.id = :id', { id: id })
      .getOne();

    this.logger.log(JSON.stringify(user));
    return user.history;
  }

  async saveHistory(id: number, query: string) {
    if (!id) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    let userHistory = await this.userHistoryRepository
      .createQueryBuilder('history')
      .leftJoinAndSelect(User, 'user', 'user.id = history.userId')
      .where('history.word = :wordQuery and user.id = :id', {
        wordQuery: query,
        id: id,
      })
      .getOne();

    if (userHistory != null) {
      this.logger.log('Updating history' + id + ' - ' + query);
      this.logger.debug(JSON.stringify(userHistory));
      userHistory.lastAccessed = new Date();
      this.userHistoryRepository.save(userHistory);
    } else {
      let user = await this.findByIdIncludeRelations(id, ['history']);

      let newUserHistory = new UserHistory();
      newUserHistory.user = user;
      newUserHistory.word = query;

      const history = await this.userHistoryRepository.save(newUserHistory);
      user.history.push(history);
      await this.userRepository.save(user);
    }
  }
}
