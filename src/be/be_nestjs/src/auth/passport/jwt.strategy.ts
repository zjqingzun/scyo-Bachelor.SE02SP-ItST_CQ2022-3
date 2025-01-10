import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@/module/user/user.service';
import { HotelsService } from '@/module/hotel/hotels.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UserService,
    private hotelService: HotelsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmail(payload.email);
    const role = await this.usersService.getRole(user.id);
    const hotel = await this.hotelService.findOneByOwnerId(user.id);

    const { password, accountType, codeId, codeExpired, ...userInfo } = user;
    return { ...userInfo, role, hotel };
  }
}
