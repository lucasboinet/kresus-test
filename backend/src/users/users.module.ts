import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { UserRepository } from './users.repository';

@Module({
  providers: [UsersService, UserRepository, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
