import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodosService } from './todos.service';

@Injectable()
export class TodoOwnerGuard implements CanActivate {
  constructor(private todosService: TodosService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    const todo = await this.todosService.findById(params.id);

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
