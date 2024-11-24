import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
  UpdateDateColumn,
} from 'typeorm';
import { IsInt, IsString, Min, IsBoolean } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Wish } from 'src/wishes/wish.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @CreateDateColumn()
  @IsString()
  createdAt: Date;

  @UpdateDateColumn()
  @IsString()
  updatedAt: Date;

  @Column({ default: 0 })
  @IsInt()
  @Min(1)
  amount: number;

  @Column()
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  @JoinTable()
  userId: User;

  @ManyToOne(() => Wish, { onDelete: 'CASCADE' })
  @JoinTable()
  itemId: Wish;
}
