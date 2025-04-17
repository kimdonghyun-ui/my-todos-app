export interface TransactionGetAttributes {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  memo: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
export interface GetTransaction {
  id: number;
  attributes: TransactionGetAttributes;
}

export interface TransactionPostAttributes {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  memo: string;
  date: string;
  users_permissions_user: string;
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
  recentTransactions: GetTransaction[];
  totalAssets: number;
}