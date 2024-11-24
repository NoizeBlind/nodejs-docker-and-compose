import { Injectable, UnauthorizedException } from '@nestjs/common';
import { checkPasswordHash } from 'src/helpers';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const dbHash = await this.UsersService.findUserPassword(username);

      if (!dbHash) {
        return false;
      }

      const compare = await checkPasswordHash(pass, dbHash);

      return compare;
    } catch (e) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
  }

  async login(user) {
    try {
      const payload = { username: user.username, id: user.userId };

      return {
        access_token: this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
        }),
      };
    } catch (_e) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
  }
}
