import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from 'src/helpers';
import { LocalAuthGuard } from './guards-n-strats/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('')
export class AuthController {
  constructor(
    private AuthService: AuthService,
    private UsersService: UsersService,
  ) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@Request() req) {
    return this.AuthService.login(req.user);
  }

  @Post('signup')
  @Public()
  create(@Body() user: CreateUserDto) {
    return this.UsersService.create(user);
  }
}
