import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { wishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { Public } from 'src/helpers';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private WishesService: wishesService) {}

  @Get()
  findAll() {
    return this.WishesService.findAll();
  }

  @Get('/last')
  @Public()
  findLastWishes() {
    return this.WishesService.findRecent();
  }

  @Get('/top')
  @Public()
  findTopWishes() {
    return this.WishesService.findTop();
  }

  @Get('/:id')
  findSingleWish(@Param('id') id: number) {
    return this.WishesService.findSingleWish(id);
  }

  @Post()
  create(@Body() wish: CreateWishDto, @Req() req) {
    return this.WishesService.create(wish, req.user.username);
  }

  @Post('/:id/copy')
  copy(@Param('id') id: number, @Req() req) {
    return this.WishesService.copy(id, req.user.username);
  }

  @Patch('/:id')
  patchMeUp(@Param('id') id: number, @Body() wish: UpdateWishDto, @Req() req) {
    return this.WishesService.patchSingleWish(id, wish, req.user.username);
  }

  @Delete('/:id')
  destroy(@Param('id') id: number, @Req() req): Promise<Wish> {
    return this.WishesService.destroySingleWish(id, req.user.username);
  }
}
