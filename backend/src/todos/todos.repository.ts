import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Todo } from '@prisma/client';
import {
  CreateTodoPayload,
  UpdateTodoPayload,
} from './entities/todo.interface';

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number, offset: number, limit: number): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: { userId },
      skip: offset,
      take: limit,
    });
  }

  countAll(userId: number): Promise<number> {
    return this.prisma.todo.count({ where: { userId } });
  }

  findById(id: number): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where: { id } });
  }

  findByTitle(userId: number, title: string): Promise<Todo | null> {
    return this.prisma.todo.findFirst({
      where: { userId, title: { equals: title } },
    });
  }

  create(userId: number, data: CreateTodoPayload): Promise<Todo> {
    return this.prisma.todo.create({ data: { ...data, userId } });
  }

  update(id: number, data: UpdateTodoPayload): Promise<Todo> {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  delete(id: number): Promise<Todo> {
    return this.prisma.todo.delete({ where: { id } });
  }
}
