import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AllergiesFileService } from './allergies-file.service';
import { CreatAllergiesFileDto } from './dto/create-allergies-file.dto';
import { UpdateAllergiesFileDto } from './dto/update-allergies-file.dto';

@Controller('allergies-file')
export class AllergiesFileController {
  constructor(private readonly allergiesFileService: AllergiesFileService) {}

  @Post()
  create(@Body() createAllergiesFileDto: CreatAllergiesFileDto) {
    return this.allergiesFileService.createFile(createAllergiesFileDto);
  }

  @Get()
  findAll() {
    return this.allergiesFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allergiesFileService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAllergiesFileDto: UpdateAllergiesFileDto,
  ) {
    return this.allergiesFileService.update(+id, updateAllergiesFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allergiesFileService.remove(+id);
  }
}
