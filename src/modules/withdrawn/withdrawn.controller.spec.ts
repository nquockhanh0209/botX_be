import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawnController } from './withdrawn.controller';

describe('WithdrawnController', () => {
  let controller: WithdrawnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawnController],
    }).compile();

    controller = module.get<WithdrawnController>(WithdrawnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
