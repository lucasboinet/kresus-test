import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import {
  CreateTodoPayload,
  UpdateTodoPayload,
} from './entities/todo.interface';
import { TodoRepository } from './todos.repository';

@Injectable()
export class TodosService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async getAllTodos(
    userId: number,
    offset: number,
    limit: number,
  ): Promise<{ data: Todo[]; total: number }> {
    const data = await this.todoRepository.findAll(userId, offset, limit);
    const total = await this.todoRepository.countAll(userId);

    return { data, total };
  }

  findById(todoId: number): Promise<Todo | null> {
    return this.todoRepository.findById(todoId);
  }

  async createTodo(userId: number, data: CreateTodoPayload): Promise<Todo> {
    const exisitingTodo = await this.todoRepository.findByTitle(
      userId,
      data.title,
    );

    if (exisitingTodo)
      throw new BadRequestException('Todo with same name already exist');

    return this.todoRepository.create(userId, data);
  }

  async updateTodo(todoId: number, data: UpdateTodoPayload): Promise<Todo> {
    return this.todoRepository.update(todoId, data);
  }

  async deleteTodo(todoId: number): Promise<void> {
    await this.todoRepository.delete(todoId);
  }
}
