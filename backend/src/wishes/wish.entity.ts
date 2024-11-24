import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  IsInt,
  IsString,
  MinLength,
  MaxLength,
  Max,
  Min,
} from 'class-validator';
import { User } from 'src/users/user.entity';
import { Offer } from 'src/offers/offer.enity';

@Entity('wishes')
export class Wish {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column()
  @IsInt()
  @Min(1)
  price: number;

  @Column()
  @IsString()
  image: string;

  @Column()
  @IsString()
  link: string;

  @Column()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column({ default: 0 })
  @IsInt()
  @Min(1)
  raised: number;

  @Column({ default: 0 })
  @IsInt()
  copied: number;

  @CreateDateColumn()
  @IsString()
  createdAt: Date;

  @UpdateDateColumn()
  @IsString()
  updatedAt: string;

  @Column()
  @IsString()
  @Min(1)
  @Max(1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.itemId)
  offers: Offer[];

  @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
  owner: User;
}
