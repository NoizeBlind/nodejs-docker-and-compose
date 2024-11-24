import {
  IsString,
  MinLength,
  MaxLength,
  Min,
  IsOptional,
} from 'class-validator';
import { User } from 'src/users/user.entity';
import { ManyToOne } from 'typeorm';

export class UpdateWishDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @Min(1)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @ManyToOne(() => User, (user) => user.id)
  owner?: User;
}
