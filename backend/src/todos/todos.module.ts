import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma.service';
import { TodoRepository } from './todos.repository';

@Module({
  imports: [],
  controllers: [TodosController],
  providers: [TodosService, TodoRepository, PrismaService],
  exports: [TodosService],
})
export class TodosModule {}
