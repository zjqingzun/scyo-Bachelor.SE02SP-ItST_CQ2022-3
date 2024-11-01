import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['../../.env.development']
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
          dir: process.cwd() + "/src/mail/templates",
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        }
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
