export type TransactionType = 'income' | 'expense';

export interface Todo {
  id: number;
  attributes: {
    content: string;
    isCompleted: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface CreateTodoInput {
  content: string;
  isCompleted?: boolean;
  userId: string;
}

export interface UpdateTodoInput {
  content?: string;
  isCompleted?: boolean;
}

export interface TodoResponse {
  data: Todo[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface TodoPostResponse {
  data: Todo;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}