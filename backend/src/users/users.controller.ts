import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Post('/find')
  @HttpCode(201)
  find(@Body() query: { query: string }) {
    return this.UsersService.searchUsers(query.query);
  }

  @Get('/me')
  findMe(@Req() request) {
    return this.UsersService.findMe(request.user.username);
  }

  @Patch('/me')
  patchMeUp(@Body() user: PatchUserDto, @Req() request) {
    return this.UsersService.patchMyUserUp(user, request.user.username);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.UsersService.findUser(username);
  }

  @Get('/me/wishes')
  findMyWishes(@Req() request) {
    return this.UsersService.findUserWishes(request.user.username);
  }

  @Get(':username/wishes')
  findWishesByUsername(@Param('username') username: string) {
    return this.UsersService.findUserWishes(username);
  }
}
