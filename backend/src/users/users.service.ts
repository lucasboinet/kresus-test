import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './users.repository';
import { CreateUserPayload } from './entities/users.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number) {
    return this.userRepository.findById(id);
  }

  async createUser(data: CreateUserPayload) {
    const saltRounds = this.configService.get<number>(
      'security.bcryptSaltOrRound',
    );
    console.log({ saltRounds });
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    return this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    });
  }
}
