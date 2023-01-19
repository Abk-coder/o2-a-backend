import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatAllergiesFileDto } from './dto/create-allergies-file.dto';
import { UpdateAllergiesFileDto } from './dto/update-allergies-file.dto';
import { AllergiesFiles } from './interfaces/allergies-file.interface';

@Injectable()
export class AllergiesFileService {
  constructor(
    @InjectModel('AllergiesFile')
    private AllergiesFileModel: Model<AllergiesFiles>,
  ) {}

  async createFile(createFileDto: CreatAllergiesFileDto) {
    try {
      const newFile = new this.AllergiesFileModel(createFileDto);
      newFile.save();
      return newFile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findAll() {
    return `This action returns all allergiesFile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} allergiesFile`;
  }

  update(id: number, updateAllergiesFileDto: UpdateAllergiesFileDto) {
    return `This action updates a #${id} allergiesFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} allergiesFile`;
  }
}
