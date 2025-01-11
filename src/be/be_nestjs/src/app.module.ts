import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/user/users.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { UserController } from './module/user/user.controller';
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
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { RoleModule } from './module/role/role.module';
import { ImageModule } from './module/image/image.module';
import { MinioService } from './minio/minio.service';
import { RoomTypeModule } from './module/room_type/room_type.module';
import { BookingDetailModule } from './module/booking_detail/booking_detail.module';
import { BookingRoomModule } from './module/booking_room/booking_room.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DailyCheckService } from './helpers/DailyCheckService';
import { RolesGuard } from './auth/guard/role.guard';

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
        logging: ['query', 'error'],
        extra: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 10000, 
        },
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
          dir: join(__dirname, '..','mail/templates'),
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
    ServiceModule,
    RoleModule,
    ImageModule,
    RoomTypeModule,
    BookingDetailModule,
    BookingRoomModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    MinioService,
    DailyCheckService
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
