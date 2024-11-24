import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private OffersService: OffersService) {}

  @Get()
  findAll() {
    return this.OffersService.findAll();
  }

  @Post()
  create(@Body() offer: CreateOfferDto, @Req() req) {
    return this.OffersService.create(offer, req.user.username);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.OffersService.findById(id);
  }
}
