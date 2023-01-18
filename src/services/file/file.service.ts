import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { logger } from 'src/utils/logger';


@Injectable()
export class FilesService {
  async uploadMultiFiles(files: [Express.Multer.File]) {
    try {
      logger.info(`--FILES.SERVICES.UPLOADFILES-- INIT`);
      let filesUrls: Array<string>;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        filesUrls[i] = await this.uploadSingleFile(file);
      }
      logger.info(`--FILES.SERVICES.UPLOADFILES-- SUCCESS`);
      return filesUrls;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async uploadSingleFile(file: Express.Multer.File) {
    logger.warn(file.fieldname);
    const authorizedExtensions = ['jpeg', 'jpg', 'png', 'webp', 'pdf'];
    const extension = file.mimetype.split('/')[1];
    if (!authorizedExtensions.includes(extension)) {
      throw new HttpException(
        'Seules les images ou les fichiers pdf sont autorisés',
        HttpStatus.FORBIDDEN,
      );
    }
    //Image size must be no more than 7Mo
    if (file.size > 7000000) {
      throw new HttpException(
        'La taille de fichier autorisée est de 7Mo maximum',
        HttpStatus.FORBIDDEN,
      );
    }
    let fileExtension: any;
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = 'png';
    } else if (file.mimetype.indexOf('jpg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('webp') > -1) {
      fileExtension = 'webp';
    } else if (file.mimetype.indexOf('pdf') > -1) {
      fileExtension = 'pdf';
    }
    logger.warn(file.path);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    logger.info('--UPLOADED FILE SUCCESSFULLY-- ' + file.path);
    return file.path;
  }
}
