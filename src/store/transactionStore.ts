import { create } from 'zustand';
import { fetchApi } from '@/lib/fetchApi';
import { Transaction, StrapiResponse, DashboardData } from '@/types/transaction';

interface TransactionState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchApi<StrapiResponse<Transaction>>('/api/transactions');
      
      // 오늘 날짜 기준으로 필터링
      const today = new Date().toISOString().split('T')[0];
      const todayTransactions = response.data.filter(
        transaction => transaction.attributes.date === today
      );

      // 오늘의 수입/지출 합계 계산
      const todaySummary = todayTransactions.reduce(
        (acc, transaction) => {
          if (transaction.attributes.type === 'income') {
            acc.totalIncome += transaction.attributes.amount;
          } else {
            acc.totalExpense += transaction.attributes.amount;
          }
          return acc;
        },
        { totalIncome: 0, totalExpense: 0, balance: 0 }
      );

      todaySummary.balance = todaySummary.totalIncome - todaySummary.totalExpense;

      // 최근 5개 거래 내역
      const recentTransactions = todayTransactions
        .sort((a, b) => new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime())
        .slice(0, 5);

      set({ 
        dashboardData: {
          todaySummary,
          recentTransactions
        },
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: '대시보드 데이터를 불러오는데 실패했습니다.', 
        isLoading: false 
      });
    }
  },
})); 