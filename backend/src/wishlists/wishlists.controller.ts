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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private WishlistsService: WishlistsService) {}

  @Get()
  findAll() {
    return this.WishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.WishlistsService.findOne(id);
  }

  @Post()
  create(@Body() wishlist: CreateWishlistDto, @Req() request) {
    return this.WishlistsService.create(wishlist, request.user.username);
  }

  @Patch(':id')
  patchWishlist(
    @Param('id') id: number,
    @Body() wishlist: UpdateWishlistDto,
    @Req() req,
  ) {
    return this.WishlistsService.patchSingleWishlist(
      id,
      wishlist,
      req.user.username,
    );
  }

  @Delete('/:id')
  destroy(@Param('id') id: number, @Req() req): Promise<Wishlist> {
    return this.WishlistsService.destroySingleWishlist(id, req.user.username);
  }
}
