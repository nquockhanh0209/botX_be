import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateService } from './affiliate.service';

describe('AffiliateService', () => {
  let service: AffiliateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffiliateService],
    }).compile();

    service = module.get<AffiliateService>(AffiliateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
