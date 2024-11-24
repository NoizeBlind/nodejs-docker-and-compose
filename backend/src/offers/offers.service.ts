import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './offer.enity';
import { UsersService } from 'src/users/users.service';
import { wishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesSerivce: wishesService,
  ) {}

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({ relations: ['userId', 'itemId'] });
  }

  async create(offer: CreateOfferDto, me: string): Promise<Offer> {
    const user = await this.usersService.findUser(me);
    const wish = await this.wishesSerivce.findSingleWish(offer.itemId as unknown as number)

    if (!wish) {
      throw new NotFoundException()
    }
    
    if ((wish.owner?.username === me)) {
      throw new ForbiddenException()
    }

    await this.wishesSerivce.updateRaisedWish(+offer.itemId, offer.amount);

    return await this.offerRepository.save({
      ...offer,
      userId: user,
      item: offer.itemId,
    });
  }

  async findById(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['userId', 'itemId'],
    });

    return offer;
  }
}
