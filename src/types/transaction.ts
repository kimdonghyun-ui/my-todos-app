export interface TransactionAttributes {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  memo: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Transaction {
  id: number;
  attributes: TransactionAttributes;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface DashboardData {
  todaySummary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
  recentTransactions: Transaction[];
} 