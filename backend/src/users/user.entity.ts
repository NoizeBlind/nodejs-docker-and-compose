import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { IsInt, IsString, IsEmail } from 'class-validator';
import { Wish } from 'src/wishes/wish.entity';
import { Wishlist } from 'src/wishlists/wishlist.entity';
import { Offer } from 'src/offers/offer.enity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column({ unique: true })
  @IsString()
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsString()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @CreateDateColumn()
  @IsString()
  createdAt: Date;

  @UpdateDateColumn()
  @IsString()
  updatedAt: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Offer, (Offer) => Offer.userId)
  offers: Offer[];

  @OneToMany(() => Wishlist, (Wishlist) => Wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Wish, (Wish) => Wish.owner)
  wishes: Wish[];
}
