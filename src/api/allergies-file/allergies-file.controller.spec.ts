import { Test, TestingModule } from '@nestjs/testing';
import { AllergiesFileController } from './allergies-file.controller';
import { AllergiesFileService } from './allergies-file.service';

describe('AllergiesFileController', () => {
  let controller: AllergiesFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllergiesFileController],
      providers: [AllergiesFileService],
    }).compile();

    controller = module.get<AllergiesFileController>(AllergiesFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
