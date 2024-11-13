import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
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
}
