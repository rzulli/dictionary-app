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

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getProfile() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('me/history')
  getHistory(@Request() req) {
    this.logger.log('Get History');
    return 'Get History';
  }

  @UseGuards(AuthGuard)
  @Get('me/favorites')
  getFavorites(@Request() req) {
    this.logger.log('Get favorites');
    return 'Get favorites';
  }
}
