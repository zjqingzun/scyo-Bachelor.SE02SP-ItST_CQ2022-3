import { User } from '@/module/user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

  async sendUserActivation(user: any) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>',
      subject: 'Successfully Registered',
      template: './register',
      context: {
        name: user.name,
      },
    });
  }

  async sendResetPassword(user : any) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>',
      subject: 'Reset your password',
      template: './resetpass',
      context: {
        name: user.name,
        activationCode: user.codeId
      },
    });
  }
}
