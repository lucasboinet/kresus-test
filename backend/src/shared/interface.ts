import { IsInt, IsOptional, Min } from 'class-validator';

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  total: number;
  hasMore: boolean;
}

export class PaginationPayload {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
