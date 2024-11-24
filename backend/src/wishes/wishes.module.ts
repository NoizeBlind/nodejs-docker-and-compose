import { Module } from '@nestjs/common';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { wishesService } from './wishes.service';
import { Wish } from './wish.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), UsersModule],
  providers: [wishesService],
  controllers: [WishesController],
  exports: [wishesService],
})
export class WishesModule {}
