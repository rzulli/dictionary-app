import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { UserHistory } from './entities/userHistory.entity';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserHistory]),
    TypeOrmModule.forFeature([Dictionary]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
