
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/module/users/user.service';
import { comparePassword } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService, 
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    let isValidPassword = await comparePassword(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const {password, ...res} = user;
    return res;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithGoogle(user: any) {
    const existed = await this.usersService.findByEmail(user.email);
    if (existed) {
      const payload = { email: user.email, sub: user.username };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }

  async register(createAuthDto : CreateAuthDto) {
    const user = await this.usersService.registerUser(createAuthDto);
    this.mailService.sendUserActivation(user);
    return user;
  }

  // async sendEmail() {
  //   this.mailerService
  //     .sendMail({
  //       to: 'ngthnha04@gmail.com', // list of receivers
  //       //from: 'noreply@nestjs.com', // sender address
  //       subject: 'Testing Nest MailerModule ✔', // Subject line
  //       text: 'welcome', // plaintext body
  //       html: '<b>welcome</b>', // HTML body content
  //     })
  // }

  // async signIn(email: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findByEmail(email);
  //   if (!user) {
  //     throw new UnauthorizedException("Email does not exist");
  //   }
  //   let isValidPassword = await comparePassword(pass, user.password);
  //   if (!isValidPassword) {
  //     throw new UnauthorizedException("Invalid password");
  //   }
  //   const payload = { sub: user.id, email: user.email };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }
}