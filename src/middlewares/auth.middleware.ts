import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction, Response } from 'express';
import { AuthService } from 'src/api/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  requestToken: string = null;
  decodedToken: Promise<any> = null;
  constructor(private authService: AuthService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['x-access-token']) {
      const token = String(req.headers['x-access-token']);
      try {
        this.decodedToken = this.authService.validateToken(token);
        this.decodedToken
          .then(async (result) => {
            const user = await this.authService.findUserById(result.userId);
            if (!user) {
              return res.status(HttpStatus.NOT_FOUND).send({
                error: 'User not found',
              });
            }
            req['user'] = user;
            next();
          })
          .catch((error) => {
            return res.status(HttpStatus.UNAUTHORIZED).json({
              error: error.message,
            });
          });
      } catch (error) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: error.message,
        });
      }
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: 'An error occured',
      });
    }
  }
}
