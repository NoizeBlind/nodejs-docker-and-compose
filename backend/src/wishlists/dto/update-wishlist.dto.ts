import { Column, ManyToMany } from 'typeorm';
import { IsString, Max, Min, IsOptional } from 'class-validator';
import { Wish } from 'src/wishes/wish.entity';

export class UpdateWishlistDto {
  @Column()
  @IsString()
  @Min(1)
  @Max(250)
  @IsOptional()
  name: string;

  @Column({ default: '' })
  @IsOptional()
  image: string;

  @ManyToMany(() => Wish)
  itemsId: number[];
}
