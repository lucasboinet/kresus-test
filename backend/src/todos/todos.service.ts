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

  getAllTodos(userId: number): Promise<Todo[]> {
    return this.todoRepository.findAll(userId);
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

  async updateTodo(
    userId: number,
    todoId: number,
    data: UpdateTodoPayload,
  ): Promise<Todo> {
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) throw new NotFoundException('Todo not found');

    if (todo.userId !== userId) throw new ForbiddenException('Not allowed');

    return this.todoRepository.update(todoId, data);
  }

  async deleteTodo(userId: number, todoId: number): Promise<void> {
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) throw new NotFoundException('Todo not found');

    if (todo.userId !== userId) throw new ForbiddenException('Not allowed');

    await this.todoRepository.delete(todoId);
  }
}
