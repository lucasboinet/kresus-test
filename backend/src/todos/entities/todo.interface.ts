import { IsDateString, IsEnum, IsOptional, Length } from 'class-validator';

export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateTodoPayload {
  @Length(1, 50)
  title!: string;

  @Length(1, 256)
  content!: string;

  @IsEnum(TodoPriority)
  priority!: TodoPriority;

  @IsOptional()
  @IsDateString()
  executionDate?: Date;
}

export class UpdateTodoPayload {
  @IsOptional()
  @Length(1, 50)
  title?: string;

  @IsOptional()
  @Length(1, 256)
  content?: string;

  @IsOptional()
  @IsEnum(TodoPriority)
  priority?: TodoPriority;

  @IsOptional()
  @IsDateString()
  executionDate?: Date;

  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}
