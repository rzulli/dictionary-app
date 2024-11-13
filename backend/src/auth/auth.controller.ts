import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
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
import { HttpErrorFilter } from 'src/http-error-filter/http-error.filter';

@Controller('auth')
@UseFilters(new HttpErrorFilter())
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
    return await this.authService.signIn(auth.email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() userForm: CreateUserDto) {
    this.logger.log('Creating user ' + JSON.stringify(userForm));

    await this.userService.create(userForm);
    return await this.authService.signIn(userForm.email);
  }
}
