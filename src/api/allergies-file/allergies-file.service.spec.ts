import { Test, TestingModule } from '@nestjs/testing';
import { AllergiesFileService } from './allergies-file.service';

describe('AllergiesFileService', () => {
  let service: AllergiesFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllergiesFileService],
    }).compile();

    service = module.get<AllergiesFileService>(AllergiesFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
