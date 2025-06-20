import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorator/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  healthCheck() {
    return {
      status: 'ok',
      message: 'Moving API Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
