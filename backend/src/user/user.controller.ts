import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './entities/user.entity';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserHistory } from './entities/userHistory.entity';
import { Dictionary } from 'src/dictionary/entities/dictionary.entity';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req): Promise<UserProfileDto> {
    const user = await this.userService.getProfile(req.user.id);
    let profile = new UserProfileDto();
    profile.email = user.email;
    profile.name = user.name;
    profile.favorites = user.favorites;
    profile.history = user.history;
    return profile;
  }

  @UseGuards(AuthGuard)
  @Get('me/history')
  async getHistory(@Request() req) {
    this.logger.log('me/history - ' + req.user.id);
    const history = await this.userService.getHistory(req.user.id);
    this.logger.debug(JSON.stringify(history));
    return history;
  }

  @UseGuards(AuthGuard)
  @Get('me/favorites')
  async getFavorites(@Request() req): Promise<Dictionary[]> {
    this.logger.log('me/favorites - ' + req.user.id);
    const user = await this.userService.findByIdIncludeRelations(req.user.id, [
      'favorites',
    ]);
    this.logger.debug(JSON.stringify(user));
    return user.favorites;
  }
}
