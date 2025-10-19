interface PaginatedResponse<T> {
  data: T[];
  page: number;
  total: number;
  hasMore: boolean;
}
