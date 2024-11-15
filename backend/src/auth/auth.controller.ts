import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './const/const';
import { AuthGuard } from './auth.guard';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { HttpExceptionFilter } from 'src/http-error-filter/http-error.filter';
import { error } from 'console';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() auth: AuthDto) {
    const user = await this.authService.signIn(auth.email, auth.password);

    let profile = await this.userService.findOneById(user.id);
    delete profile.password;

    return { ...profile, ...user };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() userForm: CreateUserDto) {
    this.logger.log('Creating user ' + JSON.stringify(userForm));

    return await this.userService.create(userForm);
  }
}
