import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { wishesService } from 'src/wishes/wishes.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishService: wishesService,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async destroySingleWishlist(id: number, me: string): Promise<Wishlist> {
    const existingWishlist = await this.findOne(id);
    if (existingWishlist.owner.username !== me) {
      throw new ForbiddenException();
    }

    await this.wishlistRepository.delete({ id });

    return existingWishlist;
  }

  async create(
    wishlist: CreateWishlistDto,
    username: string,
  ): Promise<Wishlist> {
    const { itemsId, image, name } = wishlist;

    const wishes = await Promise.all(
      (itemsId || []).map((id) => this.wishService.findByIdOrFail(id)),
    );
    return this.wishlistRepository.save({
      name,
      image,
      items: wishes,
      owner: { username: username },
    });
  }

  async patchSingleWishlist(
    id: number,
    wish: UpdateWishlistDto,
    me: string,
  ): Promise<Wishlist> {
    const { name, image, itemsId } = wish;

    const existingWishlist = await this.wishlistRepository.findOne({
      where: { id: id, owner: { username: me } },
    });
    if (!existingWishlist) {
      throw new ForbiddenException();
    }

    const newWishes = await Promise.all(
      (itemsId || []).map((id) => this.wishService.findByIdOrFail(id)),
    );

    const newWish = this.wishlistRepository.merge(existingWishlist, {
      name,
      image,
      items: newWishes.length ? newWishes : undefined,
    });

    const res = await this.wishlistRepository.save(newWish);

    return res;
  }
}
