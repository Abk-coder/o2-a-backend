import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Head } from '../utils/enums/headers.enum';
import { Observable } from 'rxjs';
import { Request } from 'express';
// Can be used for don't allow someone to alter headers will be implemented in next version
/* const Header = { 
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  API_KEY: 'appkey',
  ACCEPT: 'accept',
  ACCEPT_ENCODING: 'accept-encoding',
} as const; */
@Injectable()
export class HeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();

    this.setHeaders(request);

    return next.handle();
  }

  private setHeaders(request): void {
    this.updateHeaders(request, Head.ACCEPT, 'application/json');
    this.updateHeaders(request, Head.CONTENT_TYPE, 'application/json');
    this.updateHeaders(request, Head.ACCEPT_ENCODING, 'gzip, deflate, br');
    this.updateHeaders(request, Head.AUTHORIZATION, `authorized`);
    this.updateHeaders(request, Head.API_KEY, '');
  }

  private updateHeaders(
    request: Request,
    property: string,
    value: string,
  ): void {
    if (!request.headers.hasOwnProperty(property)) {
      request.headers[property] = value;
    } else {
      void 0;
    }
  }
}
