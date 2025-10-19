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
import { PaginatedResponse, PaginationPayload } from 'src/shared/interface';
import { TodoOwnerGuard } from './todos.guards';

@Controller('todos')
@UseGuards(AuthGuard('jwt'))
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get('/')
  async getTodos(
    @UserDecorator() user,
    @Query() pagination: PaginationPayload,
  ): Promise<PaginatedResponse<Todo>> {
    const { page = 1, limit = 15 } = pagination;
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
  @UseGuards(TodoOwnerGuard)
  updateTodo(
    @UserDecorator() user,
    @Param('id', ParseIntPipe) todoId: number,
    @Body() updatePayload: UpdateTodoPayload,
  ): Promise<Todo> {
    return this.todosService.updateTodo(todoId, updatePayload);
  }

  @Delete('/:id')
  @UseGuards(TodoOwnerGuard)
  async deleteTodo(
    @UserDecorator() user,
    @Param('id', ParseIntPipe) todoId: number,
  ): Promise<{ message: string }> {
    await this.todosService.deleteTodo(todoId);
    return { message: 'Todo deleted successfully' };
  }
}
