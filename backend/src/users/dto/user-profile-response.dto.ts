import {
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  IsEmail,
} from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class UserResponseDto {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  username: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  about: string;

  @IsString()
  avatar: string;

  @CreateDateColumn()
  @IsString()
  createdAt: Date;

  @UpdateDateColumn()
  @IsString()
  updatedAt: string;
}

export class UserProfileResponseDto extends UserResponseDto {
  @IsEmail()
  email: string;
}
