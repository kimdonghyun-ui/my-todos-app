import { create } from 'zustand';
import { fetchApi } from '@/lib/fetchApi';
import { GetTransaction, StrapiResponse, DashboardData, TransactionPostAttributes, TransactionGetAttributes } from '@/types/transaction';
import { getTodayKST } from '@/utils/utils';
import { toast } from 'react-hot-toast';

interface TransactionState {
  dashboardData: DashboardData | null;
  transactions: GetTransaction[];
  statistics: {
    monthlyData: GetTransaction[];
    incomeByCategory: { category: string; amount: number }[];
    expenseByCategory: { category: string; amount: number }[];
  } | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: (userId: string) => Promise<void>;
  fetchCreateTransaction: (transactionData: TransactionPostAttributes) => Promise<void>;
  fetchUpdateTransaction: (id: number, transactionData: TransactionPostAttributes) => Promise<void>;
  fetchTransactions: (userId: string, filters?: { viewType?: 'all' | 'monthly' | 'daily', type?: 'income' | 'expense', date?: string }) => Promise<void>;
  fetchDetailTransaction: (id: number) => Promise<TransactionGetAttributes | null>;
  fetchStatistics: (userId: string, yearMonth: string) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  dashboardData: null,
  transactions: [],
  statistics: null,
  isLoading: false,
  error: null,

  // fetchDashboardData = 대시보드 데이터 불러오기(거래내역 목록)
  fetchDashboardData: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // 📡 API 호출 /transactions (filters[users_permissions_user][id][$eq]=${userId} = 로그인한 유저의 데이터만 불러오기(그냥되는건 아니고 strapi 관계형 설정 했기때문에 가능))
      const response = await fetchApi<StrapiResponse<GetTransaction>>(`/transactions?filters[users_permissions_user][id][$eq]=${userId}`);
      const data = response.data; // data = 응답 데이터(필터링 안한 데이터)

      // today = 오늘 날짜 기준으로 필터링
      const today = getTodayKST(); // 오늘 날짜 가져오기 예) 2025-04-19

      // todayTransactions = 오늘 날짜 기준으로 필터링
      const todayTransactions = data.filter(
          transaction => transaction.attributes.date === today
      );

      // 오늘의 수입,지출,잔액 계산(todayTransactions = 필터링 한 데이터 사용)
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

      // 전체 자산 계산(data = 필터링 안한 데이터 사용)
      const totalSummary = data.reduce(
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

      totalSummary.balance = totalSummary.totalIncome - totalSummary.totalExpense;
        
      // recentTransactions = 최근 거래 내역 5건(data = 필터링 안한 데이터 사용) (createdAt기준 으로 정렬(sort) 후 slice(0, 5)앞에서 5개 추출) 
      const recentTransactions = data
      .sort((a, b) => new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime())
      .slice(0, 5);

      set({ 
        dashboardData: {
          todaySummary,
          recentTransactions,
          totalAssets: totalSummary.balance
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
  fetchCreateTransaction: async (transactionData) => {
    set({ isLoading: true, error: null });
    try {
      // 📡 API 호출 /transactions (데이터 저장)
      await fetchApi<StrapiResponse<GetTransaction>>('/transactions', {
        method: 'POST',
        body: JSON.stringify({ data: transactionData }),
      });
      toast.success('거래 내역 저장 성공!');
    } catch (err) {
      set({ error: '거래 내역 저장 실패!' });
      toast.error('거래 내역 저장 실패!');
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // fetchUpdateTransaction = 거래 내역 수정
  fetchUpdateTransaction: async (id, transactionData) => {
    set({ isLoading: true, error: null });
    try {
      // 📡 API 호출 /transactions/${id} (데이터 수정)
      await fetchApi<StrapiResponse<GetTransaction>>(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: transactionData }),
      });
      toast.success('거래 내역 수정 성공!');
    } catch {
      set({ error: '거래 내역 수정 실패!' });
      toast.error('거래 내역 수정 실패!');
    } finally {
      set({ isLoading: false });
    }
  },
  
  // fetchTransactions = 거래 내역 조회
  fetchTransactions: async (userId, filters) => {
    set({ isLoading: true, error: null });
  
    try {
      const queryParams = new URLSearchParams();
  
      // 📅 날짜 필터 처리 (월 기준)
      if (filters?.viewType === 'monthly') {
        // ##### 월별 거래 내역 조회 #####
        if (!filters.date) { //filters.date 값이 없는 경우 토스트 메시지 출력
           //filters.date = 2025-06
          toast.error('월별 날짜 값이 없습니다.');
          return;
        }

        // #####
        // ##### strapi에서 월별 데이터 호출할때 고려할점 #####
        // [월별기준]
        // 예)filters[date][$eq]: 2025-05 형태로 하면 안됨...!!! 아래예시처럼 범위 형태로 해야함
        // 예)filters[date][$gte]: 2025-05-01 & filters[date][$lte]: 2025-05-31 형태로 해야함

        // [일별기준]
        // 예)filters[date][$eq]: 2025-04-19 형태로 하면 잘됨

        // strapi 에서는 2025-05-05 같은 일별 기준으로는 조회가 되는데 2025-05 같은 월별 기준으로는 조회가 안되서 월별 기준으로 조회하기 위해 아래 코드 추가
        // 예) 2025-05 월별 기준으로 조회하면 2025-05-01 ~ 2025-05-31 까지 조회됨
        // ##### strapi에서 월별 데이터 호출할때 고려할점 #####
        // #####

        // ### filters.date 기준달의 마지막 날 계산 ###
        const [year, month] = filters.date.split('-'); // 예) year = 2025, month = 06
        const lastDay = new Date(Number(year), Number(month), 0).getDate(); // 해당 달의 마지막 날 (28~31중 하나)

        const startDate = `${filters.date}-01`; // 예) 2025-06-01
        const endDate = `${filters.date}-${lastDay.toString().padStart(2, '0')}`; // 예) 2025-06-30
  
        queryParams.append('filters[date][$gte]', startDate);
        queryParams.append('filters[date][$lte]', endDate);
  
      } else if (filters?.viewType === 'daily') { // 📅 날짜 필터 처리 (일별 기준)
        if (!filters.date) { //filters.date 값이 없는 경우 토스트 메시지 출력
          //filters.date = 2025-06-16
          toast.error('일별 날짜 값이 없습니다.');
          return;
        }
  
        queryParams.append('filters[date][$eq]', filters.date);
      }
  
      // 💰 수입/지출 타입 필터
      if (filters?.type) {
        queryParams.append('filters[type][$eq]', filters.type);
      }
    
      // 📡 API 호출 (queryParams 조건에 맞는 데이터 조회)
      const response = await fetchApi<StrapiResponse<GetTransaction>>(`/transactions?filters[users_permissions_user][id][$eq]=${userId}&${queryParams.toString()}`);
      const data = response.data;

      set({ transactions: data });
  
    } catch {
      set({ error: '거래 내역을 불러오는데 실패했습니다.' });
      toast.error('거래 내역을 불러오는데 실패했습니다.');
    } finally {
      set({ isLoading: false });
    }
  },
  
  // fetchDetailTransaction = 거래 내역 상세 조회
  fetchDetailTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // 📡 API 호출 /transactions/${id} (id 기준 데이터 조회)
      const response = await fetchApi<{ data: GetTransaction }>(`/transactions/${id}`);
      const data = response.data.attributes;
      return data;
    } catch {
      set({ error: '거래 상세 내역을 불러오는데 실패했습니다.' });
      toast.error('거래 상세 내역을 불러오는데 실패했습니다.');
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // deleteTransaction = 거래 내역 삭제
  deleteTransaction: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // 📡 API 호출 /transactions/${id} (id 기준 데이터 삭제)
      await fetchApi(`/transactions/${id}`, {
        method: 'DELETE',
      });

      // 스토어 스테이트 데이터 transactions 안에서도 필터링 해서 해당 id 데이터 삭제
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
      toast.success('거래 내역이 삭제되었습니다.');
    } catch {
      set({ error: '거래 내역 삭제에 실패했습니다.' });
      toast.error('거래 내역 삭제에 실패했습니다.');
    } finally {
      set({ isLoading: false });
    }
  },

  // fetchStatistics = 통계 데이터 조회
  fetchStatistics: async (userId: string, yearMonth: string) => {
    set({ isLoading: true, error: null });
    try {
      // 해당 월의 시작일과 마지막일 계산
      const [year, month] = yearMonth.split('-');
      const startDate = `${yearMonth}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      const endDate = `${yearMonth}-${lastDay.toString().padStart(2, '0')}`;

      // API 호출
      const response = await fetchApi<StrapiResponse<GetTransaction>>(
        `/transactions?filters[users_permissions_user][id][$eq]=${userId}&filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}`
      );

      // 카테고리별 금액 계산
      const incomeByCategory = new Map<string, number>();
      const expenseByCategory = new Map<string, number>();

      response.data.forEach((transaction) => {
        const { type, category, amount } = transaction.attributes;
        const categoryMap = type === 'income' ? incomeByCategory : expenseByCategory;
        categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
      });

      // Top 5 카테고리 정렬
      const sortedIncomeCategories = Array.from(incomeByCategory.entries())
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      const sortedExpenseCategories = Array.from(expenseByCategory.entries())
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      set({
        statistics: {
          monthlyData: response.data,
          incomeByCategory: sortedIncomeCategories,
          expenseByCategory: sortedExpenseCategories,
        },
      });
    } catch {
      set({ error: '통계 데이터를 불러오는데 실패했습니다.' });
      toast.error('통계 데이터를 불러오는데 실패했습니다.');
    } finally {
      set({ isLoading: false });
    }
  },
})); 