import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './offer.enity';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), UsersModule, WishesModule],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}
