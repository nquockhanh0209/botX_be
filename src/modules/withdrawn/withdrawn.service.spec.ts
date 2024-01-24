import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawnService } from './withdrawn.service';

describe('WithdrawnService', () => {
  let service: WithdrawnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawnService],
    }).compile();

    service = module.get<WithdrawnService>(WithdrawnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
