import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/users/users.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { UserController } from './module/users/user.controller';
import { logger } from './logger/logger.fn.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { HotelsModule } from './module/hotel/hotels.module';
import { RoomsModule } from './module/room/rooms.module';
import { LocationsModule } from './module/location/locations.module';
import { ReviewModule } from './module/review/review.module';
import { PaymentModule } from './module/payment/payment.module';
import { BookingModule } from './module/booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';
import { BillModule } from './module/bill/bill.module';
import { ReportModule } from './module/report/report.module';
import { ServiceModule } from './module/service/service.module';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['.env.development']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService : ConfigService) => ({
        transport: {
          host: configService.get<string>('MAILDEV_HOST'),
          port: configService.get<number>('MAILDEV_PORT'),
          ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('MAILDEV_USER'),
            pass: configService.get<string>('MAILDEV_PASSWORD')
          },
        },
        defaults: {
          from: '"No Reply"',
        },
        template: {
          dir: join(__dirname, '..', 'mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        }
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    HotelsModule,
    RoomsModule,
    LocationsModule,
    ReviewModule,
    PaymentModule,
    BookingModule,
    AuthModule,
    MailModule,
    BillModule,
    ReportModule,
    ServiceModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource : DataSource) {
    
  }

  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(LoggerMiddleware).forRoutes({path: 'users/*', method: RequestMethod.GET});
    // consumer
    //   //.apply(LoggerMiddleware)
    //   .apply(logger, LoggerMiddleware)
    //   .exclude({path: 'users/getAllUsers/:id/:name', method: RequestMethod.GET})
    //   .forRoutes(UserController);
  }
}
