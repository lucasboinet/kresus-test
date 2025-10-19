import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Todo } from '@prisma/client';
import { TodosService } from './todos.service';
import { UserDecorator } from 'src/users/users.decorator';
import {
  CreateTodoPayload,
  UpdateTodoPayload,
} from './entities/todo.interface';

@Controller('todos')
@UseGuards(AuthGuard('jwt'))
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get('/')
  async getTodos(
    @UserDecorator() user,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 15,
  ): Promise<PaginatedResponse<Todo>> {
    const offset = (page - 1) * limit;

    const { data, total } = await this.todosService.getAllTodos(
      user.id,
      offset,
      limit,
    );

    return {
      data,
      page,
      total,
      hasMore: offset + limit < total,
    };
  }

  @Post('/')
  createTodo(
    @UserDecorator() user,
    @Body() createPayload: CreateTodoPayload,
  ): Promise<Todo> {
    return this.todosService.createTodo(user.id, createPayload);
  }

  @Put('/:id')
  updateTodo(
    @UserDecorator() user,
    @Param('id', ParseIntPipe) todoId: number,
    @Body() updatePayload: UpdateTodoPayload,
  ): Promise<Todo> {
    return this.todosService.updateTodo(user.id, todoId, updatePayload);
  }

  @Delete('/:id')
  async deleteTodo(
    @UserDecorator() user,
    @Param('id', ParseIntPipe) todoId: number,
  ): Promise<{ message: string }> {
    await this.todosService.deleteTodo(user.id, todoId);
    return { message: 'Todo deleted successfully' };
  }
}
