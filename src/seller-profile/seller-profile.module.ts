import { Module } from '@nestjs/common';
import { SellerProfileController } from './seller-profile.controller';

@Module({
  controllers: [SellerProfileController]
})
export class SellerProfileModule {}
