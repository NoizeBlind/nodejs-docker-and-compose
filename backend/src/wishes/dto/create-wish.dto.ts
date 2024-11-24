import {
  IsString,
  MinLength,
  MaxLength,
  Min,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { User } from 'src/users/user.entity';
import { ManyToOne } from 'typeorm';

export class CreateWishDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  @IsOptional()
  name: string;

  @IsString()
  link: string;

  @IsString()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsString()
  description: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;
}
