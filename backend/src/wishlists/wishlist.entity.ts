import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  UpdateDateColumn,
} from 'typeorm';
import { IsInt, IsString, Max, Min } from 'class-validator';
import { Wish } from 'src/wishes/wish.entity';
import { User } from 'src/users/user.entity';

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column()
  @IsString()
  @Min(1)
  @Max(250)
  name: string;

  @Column({ default: '' })
  @IsString()
  @Max(1500)
  description: string;

  @Column({ default: '' })
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  owner: User;

  @CreateDateColumn()
  @IsString()
  createdAt: Date;

  @UpdateDateColumn()
  @IsString()
  updatedAt: string;
}
