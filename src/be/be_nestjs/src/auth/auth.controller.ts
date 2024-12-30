import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Public } from '@/helpers/decorator/public';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { ResetpassAuthDto } from './dto/resetpassword-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('renew_token/:refreshToken')
  @Public()
  async renewToken(@Param('refreshToken') refreshToken : string) {
    return await this.authService.refreshAccessToken(refreshToken);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register/:role')
  @Public()
  async register(@Body() createAuthDto: CreateAuthDto, @Param('role') role : string) {
    return this.authService.register(createAuthDto, role);
  }

  @Get('forgetPassword/:email')
  @Public()
  async forgetPassword(@Param('email') email : string) {
    return await this.authService.forgetPassword(email);
  }

  @Post('resetPassword')
  @Public()
  async resetPassword(@Body() resetInfo : ResetpassAuthDto) {
    return await this.authService.resetPassword(resetInfo);
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    return "successfully";
  }

  @Get('google/redirect')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.loginWithGoogle(req.user);
  }

  // @Post('login')
  // login(@Body() createAuthDto : CreateAuthDto) {
  //   console.log(createAuthDto);
  //   return this.authService.signIn(createAuthDto.email, createAuthDto.password);
  // }
}
