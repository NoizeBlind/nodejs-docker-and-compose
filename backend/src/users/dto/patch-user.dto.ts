import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class PatchUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @IsOptional()
  username: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @IsOptional()
  about: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
