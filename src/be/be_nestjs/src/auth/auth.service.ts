import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/module/user/user.service';
import { comparePassword } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '@/mail/mail.service';
import { ResetpassAuthDto } from './dto/resetpassword-auth.dto';
import moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
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
    const { password, ...res } = user;
    return res;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const payload = { email: decoded.email, sub: decoded.sub };
      const newAccessToken = this.jwtService.sign(payload);

      return { access_token: newAccessToken };
    } catch (error) {
      // throw new UnauthorizedException('Invalid or expired refresh token');
    }
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

  async register(createAuthDto: CreateAuthDto, role: string) {
    const user = await this.usersService.registerUser(createAuthDto, role);
    this.mailService.sendUserActivation(user);
    return user;
  }

  async forgetPassword(email: string) {
    const user = await this.usersService.setupResetPassword(email);
    this.mailService.sendResetPassword(user);
    return user.codeId;
  }

  async resetPassword(resetInfo: ResetpassAuthDto) {
    return await this.usersService.resetPassword(resetInfo);
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
