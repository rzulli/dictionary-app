import { SetMetadata } from '@nestjs/common';
export default () => ({
  secret: process.env.JWT_SECRET_KEY,
});

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
