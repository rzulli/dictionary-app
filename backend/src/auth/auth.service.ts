import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new HttpException({ message: 'E-mail não encontrado.' }, 400);
    }
    if (user.password !== password) {
      throw new HttpException({ message: 'Senha inválida.' }, 400);
    }
    const payload = { id: user.id, name: user.name };
    const token = {
      token: await this.jwtService.signAsync(payload),
    };
    //await this.redisCache.storeData(token.access_token);
    return { ...payload, ...token };
  }
}
