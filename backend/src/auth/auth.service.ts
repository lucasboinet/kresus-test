import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from './entities/login.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login({ email, password }: LoginPayload) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email };
    return new LoginResponse(this.jwt.sign(payload), user);
  }

  async register({ email, password, confirmPassword }: RegisterPayload) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    if (password !== confirmPassword)
      throw new BadRequestException("Password and confirmation don't match");

    const user = await this.usersService.createUser({
      email,
      password,
    });
    const payload = { sub: user.id, email: user.email };

    return new RegisterResponse(this.jwt.sign(payload), user);
  }

  async getProfile(userId: number) {
    return this.usersService.findById(userId);
  }
}
