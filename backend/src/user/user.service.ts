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
          this.logger.log(JSON.stringify(error));
          //23505 - code para quando unique check for quebrado
          //TODO - melhorar handling de erro. hardcode
          if (error.code == 23505) {
            reject(new HttpException('E-mail duplicado.', 400));
          }
          reject(error);
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

  async saveHistory(id: number, word: string) {
    this.logger.log('Saving history' + id + ' - ' + word);
    let user = await this.userRepository.findOne({
      where: { id },
      relations: ['history'],
    });

    if (!user || !id) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    let userHistory = new UserHistory();
    userHistory.user = user;
    userHistory.word = word;

    const history = await this.userHistoryRepository.save(userHistory);
    user.history.push(history);
    await this.userRepository.save(user);
  }
}
