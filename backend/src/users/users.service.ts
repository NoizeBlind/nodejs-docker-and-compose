import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Wish } from 'src/wishes/wish.entity';
import { AuthUser, hashPassword } from 'src/helpers';
import { PatchUserDto } from './dto/patch-user.dto';
import {
  UserProfileResponseDto,
  UserResponseDto,
} from './dto/user-profile-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['wishlists', 'wishes', 'offers'],
    });
  }

  async create(user: CreateUserDto): Promise<CreateUserDto> {
    const hashedPassword = await hashPassword(user.password);

    const searchByEmail = (await this.searchUsers(user?.email)) || [];
    const searchByName = (await this.searchUsers(user?.username)) || [];

    if (searchByEmail.length || searchByName.length) {
      throw new HttpException(
        'Пользователь с таким email или username уже зарегистрирован',
        409,
      );
    }

    const newUser = this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return { ...newUser, password: undefined };
  }

  async findUser(name: string): Promise<UserResponseDto> {
    try {
      const { id, username, about, avatar, createdAt, updatedAt } =
        await this.userRepository.findOneOrFail({ where: { username: name } });

      return { id, username, about, avatar, createdAt, updatedAt };
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async findMe(@AuthUser() user: string): Promise<UserProfileResponseDto> {
    const myUsername = user;

    try {
      const { id, username, about, avatar, email, createdAt, updatedAt } =
        await this.userRepository.findOneOrFail({
          where: { username: myUsername },
        });

      return { id, username, about, avatar, email, createdAt, updatedAt };
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async findUserPassword(name: string): Promise<string> {
    const { password } = await this.userRepository.findOneOrFail({
      where: { username: name },
    });

    return password;
  }

  async searchUsers(query: string): Promise<UserProfileResponseDto[]> {
    if (!query) {
      throw new HttpException('Задан пустой поисковый запрос', 400);
    }

    const res = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });

    return res.map((u) => ({
      id: u.id,
      username: u.username,
      about: u.about,
      avatar: u.avatar,
      email: u.email,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }

  async findUserWishes(name: string): Promise<Wish[]> {
    const result = await this.userRepository.findOne({
      where: { username: name },
      relations: ['wishes'],
      select: ['wishes'],
    });

    if (!result) {
      throw new NotFoundException();
    }

    if (result?.wishes?.length) {
      return [...result.wishes];
    } else return [];
  }

  async patchMyUserUp(
    user: PatchUserDto,
    myUsername: string,
  ): Promise<UserProfileResponseDto> {
    const { username, about, avatar, email, password } = user;

    const me = await this.userRepository.findOne({
      where: { username: myUsername },
    });

    const usersExist = await this.userRepository.find({
      where: [{ email }, { username }],
    });
    if (
      usersExist.length > 1 ||
      (usersExist.length && usersExist[0].id !== me.id)
    ) {
      throw new HttpException(
        'Пользователь с таким email или username уже зарегистрирован',
        409,
      );
    }

    const passwordToUse = password ? await hashPassword(password) : password;

    const userData = this.userRepository.merge(me, {
      username,
      about,
      avatar,
      email,
      password: passwordToUse,
    });

    const res = await this.userRepository.save(userData);

    return {
      id: res.id,
      username: res.username,
      about: res.about,
      avatar: res.avatar,
      email: res.email,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }
}
