import { Module } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { AllergiesController } from './allergies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AllergiesSchema } from './models/allergy.model';
import { FileService } from 'src/services/file/file.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Allergies', schema: AllergiesSchema }]),
    AllergiesModule,
  ],
  controllers: [AllergiesController],
  providers: [AllergiesService, FileService],
  exports: [AllergiesService, MongooseModule, FileService],
})
export class AllergiesModule {}
