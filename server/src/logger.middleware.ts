import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log(`Request ${req.method} ${req.originalUrl}`);
    const now = Date.now();

    res.on('finish', () => {
      const elapsed = Date.now() - now;
      console.log(
        `Response ${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed}ms`,
      );
    });

    next();
  }
}
