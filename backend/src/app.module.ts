import { Module } from '@nestjs/common';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './wishes/wish.entity';
import { WishesModule } from './wishes/wishes.module';
import { Offer } from './offers/offer.enity';
import { OffersModule } from './offers/offers.module';
import { Wishlist } from './wishlists/wishlist.entity';
import { WishlistsModule } from './wishlists/wishlists.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards-n-strats/jwt-auth.guard.ts';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    WishesModule,
    OffersModule,
    WishlistsModule,
    AuthModule,
    AppModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Wish, Offer, Wishlist],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
