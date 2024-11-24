import { compare, hash } from 'bcrypt';
import { SetMetadata } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const hashPassword = (password) => hash(password, 9).then((res) => res);

export const checkPasswordHash = (password, hash) => {
  return compare(password, hash).then((res) => res);
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AuthUser = createParamDecorator((_data, req) => {
  return req.user;
});
