import { Module } from '@nestjs/common';
import { AllergiesFileService } from './allergies-file.service';
import { AllergiesFileController } from './allergies-file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/services/file/file.service';
import { AllergiesFileSchema } from './models/allergies-file.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AllergiesFile', schema: AllergiesFileSchema },
    ]),
    AllergiesFileModule,
  ],
  controllers: [AllergiesFileController],
  providers: [AllergiesFileService, FileService],
  exports: [AllergiesFileService, MongooseModule, FileService],
})
export class AllergiesFileModule {}
