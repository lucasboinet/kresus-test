import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from '../users/users.decorator';
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from './entities/login.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerPayload: RegisterPayload,
  ): Promise<RegisterResponse> {
    return this.authService.register(registerPayload);
  }

  @Post('login')
  async login(@Body() loginPayload: LoginPayload): Promise<LoginResponse> {
    return this.authService.login(loginPayload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@UserDecorator() user) {
    return this.authService.getProfile(user.id);
  }
}
