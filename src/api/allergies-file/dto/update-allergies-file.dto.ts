import { PartialType } from '@nestjs/mapped-types';
import { CreatAllergiesFileDto } from './create-allergies-file.dto';

export class UpdateAllergiesFileDto extends PartialType(CreatAllergiesFileDto) {}
