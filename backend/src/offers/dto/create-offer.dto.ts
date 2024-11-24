import {
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { User } from 'src/users/user.entity';
import { Wish } from 'src/wishes/wish.entity';
import { ManyToOne } from 'typeorm';

export class CreateOfferDto {
  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User)
  userId: User;

  @ManyToOne(() => Wish)
  itemId: Wish;
}
