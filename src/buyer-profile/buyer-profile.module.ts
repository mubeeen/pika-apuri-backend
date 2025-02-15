import { Module } from '@nestjs/common';
import { BuyerProfileController } from './buyer-profile.controller';

@Module({
  controllers: [BuyerProfileController]
})
export class BuyerProfileModule {}
