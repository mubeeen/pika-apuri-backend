import { Test, TestingModule } from '@nestjs/testing';
import { SellerProfileController } from './seller-profile.controller';

describe('SellerProfileController', () => {
  let controller: SellerProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerProfileController],
    }).compile();

    controller = module.get<SellerProfileController>(SellerProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
