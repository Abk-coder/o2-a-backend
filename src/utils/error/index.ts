import { HttpException } from '@nestjs/common';
import { logger } from '../logger/index';
/**
 * This function is an error handler
 * @param {Error} error
 */
export const handleError = (error) => {
  const { statusCode = 500, message } = error;
  logger.error(
    `--- HANDLEERROR --- statusCode error : ${statusCode} - message error : ${message}`,
  );
};
