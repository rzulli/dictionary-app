import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DatabaseStarter,
  DatabaseStarterService,
} from './databaseStarter.module';
import { Dictionary } from './dictionary/entities/dictionary.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { EntriesModule } from './entries/entries.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

console.log(process.env.DATABASE_HOST, process.env.DATABASE_PORT);
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Dictionary, User],
      synchronize: true,
      autoLoadEntities: true,
    }),
    DatabaseStarter,
    UserModule,
    AuthModule,
    EntriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
