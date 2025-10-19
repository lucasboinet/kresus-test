import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './users.repository';
import { CreateUserPayload } from './entities/users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number) {
    return this.userRepository.findById(id);
  }

  async createUser(data: CreateUserPayload) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    });
  }
}
