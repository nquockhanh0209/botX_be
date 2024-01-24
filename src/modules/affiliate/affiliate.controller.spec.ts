import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateController } from './affiliate.controller';

describe('AffiliateController', () => {
  let controller: AffiliateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliateController],
    }).compile();

    controller = module.get<AffiliateController>(AffiliateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
