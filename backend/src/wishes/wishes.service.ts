import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './wish.entity';
import { UsersService } from 'src/users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class wishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,

    private userService: UsersService,
  ) {}

  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find({
      relations: ['owner', 'offers'],
    });
  }

  async copy(id: number, username: string): Promise<Wish> {
    const wishToCopy = await this.wishRepository.findOne({ where: { id } });
    const me = await this.userService.findUser(username);
    const meWishes = await this.userService.findUserWishes(username)

    const alreadyHasAWish = meWishes.find(wish => wish.name === wishToCopy.name)

    if (alreadyHasAWish) {
      throw new BadRequestException('Вы уже копировали себе этот подарок')
    }

    await this.wishRepository.save({
      ...wishToCopy,
      copied: wishToCopy.copied + 1,
    });
    return this.wishRepository.save({
      ...wishToCopy,
      id: undefined,
      owner: me,
    });
  }

  async findSingleWish(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          userId: true,
        },
      },
    });

    return wish;
  }

  async patchSingleWish(
    id: number,
    wish: UpdateWishDto,
    me: string,
  ): Promise<Wish> {
    const { name, link, image, price, description } = wish;

    const existingWish = await this.wishRepository.findOne({
      where: { id, owner: { username: me } },
      relations: ['owner'],
    });

    if (!existingWish || (existingWish.raised && price)) {
      throw new ForbiddenException();
    }

    const newWish = this.wishRepository.merge(existingWish, {
      name,
      link,
      image,
      price,
      description,
    });

    const res = await this.wishRepository.save(newWish);

    return res;
  }

  async updateRaisedWish(id: number, raised: number): Promise<Wish> {
    const existingWish = await this.wishRepository.findOne({ where: { id } });
    const newWish = this.wishRepository.merge(existingWish, {
      raised: (raised || 0) + existingWish.raised,
    });

    const res = await this.wishRepository.save(newWish);

    return res;
  }

  async destroySingleWish(id: number, me: string): Promise<Wish> {
    const existingWish = await this.wishRepository.findOne({
      where: { id, owner: { username: me } },
      relations: ['owner'],
    });
    if (!existingWish) {
      throw new ForbiddenException();
    }
    await this.wishRepository.delete(existingWish);

    return existingWish;
  }

  async findRecent(): Promise<Wish[]> {
    return this.wishRepository.find({
      relations: ['owner', 'offers'],
      take: 40,
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      relations: ['owner', 'offers'],
      take: 20,
      order: {
        copied: 'DESC',
        id: 'DESC',
      },
    });
  }

  async findByIdOrFail(
    id: number,
    fields?: FindOptionsSelect<Wish>,
    join?: FindOptionsRelations<Wish>,
  ): Promise<Wish> {
    return this.wishRepository.findOneOrFail({
      where: { id },
      select: fields,
      relations: join,
    });
  }

  async create(
    { name, link, image, price, description }: CreateWishDto,
    username: string,
  ): Promise<Wish> {
    const me = await this.userService.findUser(username);
    return this.wishRepository.save({
      name,
      link,
      image,
      price,
      description,
      owner: me,
    });
  }
}
