import { Injectable } from '@nestjs/common';
import { DailyCheckService } from './helpers/DailyCheckService';

@Injectable()
export class AppService {
  constructor(
    private readonly dailyCheckService: DailyCheckService
  ) {

  }

  getHello(): string {
    return 'Hello World!';
  }
}
