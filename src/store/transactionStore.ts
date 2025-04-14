import { create } from 'zustand';
import { fetchApi } from '@/lib/fetchApi';
import { GetTransaction, StrapiResponse, DashboardData, TransactionPostAttributes } from '@/types/transaction';
import { getTodayKST } from '@/utils/utils';

interface TransactionState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: (userId: string) => Promise<void>;
  fetchCreateTransaction: (transactionData: TransactionPostAttributes) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,



  // fetchDashboardData = 대시보드 데이터 불러오기(거래내역 목록)
  fetchDashboardData: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchApi<StrapiResponse<GetTransaction>>(`/transactions?filters[users_permissions_user][id][$eq]=${userId}`);
      
      // 오늘 날짜 기준으로 필터링
      const today = getTodayKST();
      const todayTransactions = response.data.filter(
        transaction => transaction.attributes.date === today
      );

      // 오늘의 수입,지출,잔액 계산
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

      // recentTransactions = 최근 거래 내역 5건(createdAt기준 으로 정렬(sort) 후 slice(0, 5)앞에서 5개 추출)
      const recentTransactions = todayTransactions
        .sort((a, b) => new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime())
        .slice(0, 5);

      set({ 
        dashboardData: {
          todaySummary,
          recentTransactions
        }
      });
    } catch {
      set({ 
        error: '대시보드 데이터를 불러오는데 실패했습니다.'
      });
    } finally {
      set({ isLoading: false });
    }
  },


  // fetchCreateTransaction = 거래 내역 저장
  fetchCreateTransaction: async (transactionData: TransactionPostAttributes) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchApi<StrapiResponse<GetTransaction>>('/transactions', {
        method: 'POST',
        body: JSON.stringify({ data: transactionData }),
      });
    } catch {
      set({ error: '거래를 저장하는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },
  



})); 