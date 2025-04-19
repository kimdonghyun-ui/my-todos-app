'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Trash2, Pencil, ChevronDown } from 'lucide-react';
import { useTransactionStore } from '@/store/transactionStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils/utils';
import { getTodayKST } from '@/utils/utils';
import { getIconByCategory } from '@/utils/categoryIcons';

type ViewType = 'all' | 'monthly' | 'daily';
type TransactionType = 'all' | 'income' | 'expense';

export default function TransactionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { transactions, isLoading, error, fetchTransactions, deleteTransaction } = useTransactionStore();
  
  const [viewType, setViewType] = useState<ViewType>('all'); // viewType = 전체, 월별, 일별
  const [selectedDate, setSelectedDate] = useState<string>(''); // selectedDate = 날짜
  const [selectedType, setSelectedType] = useState<TransactionType>('all'); // selectedType = 수입, 지출
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    
    const filters: { 
      viewType?: 'all' | 'monthly' | 'daily',
      date?: string ,
      type?: 'income' | 'expense',
    } = {};

    filters.viewType = viewType; // filters.viewType 에 viewType 값 할당

    // 날짜 값이 세팅 되어 있으면 조건 성립
    if (selectedDate) {
      filters.date = selectedDate; // filters.date 에 selectedDate 값 할당
    }

    // 수입, 지출 값이 세팅 되어 있으면 조건 성립
    if (selectedType !== 'all') {// all 인경우는 전부 노출되어야되기때문에 그냥 필터에 넣지 않음
      filters.type = selectedType; // filters.type 에 selectedType 값 할당
    }

    fetchTransactions(user?.id?.toString() || '', filters);
    
  }, [user?.id, selectedDate, selectedType, viewType, fetchTransactions]);

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteTransaction(id);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (viewType === 'monthly') {
      setSelectedDate(value.substring(0, 7)); // YYYY-MM 형식
    } else if (viewType === 'daily') {
      setSelectedDate(value); // YYYY-MM-DD 형식
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-8rem)]">
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-4 p-4">
          {/* 필터 섹션 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            {/* 드롭다운 버튼 */}
            <div className="relative w-full sm:w-32">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
              >
                <span>
                  {viewType === 'all' && '전체'}
                  {viewType === 'monthly' && '월별'}
                  {viewType === 'daily' && '일별'}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg text-sm">
                  <button
                    onClick={() => {
                      setViewType('all');
                      setSelectedDate('');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl"
                  >
                    전체
                  </button>
                  <button
                    onClick={() => {
                      setViewType('monthly');
                      setSelectedDate(getTodayKST('month'));
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    월별
                  </button>
                  <button
                    onClick={() => {
                      setViewType('daily');
                      setSelectedDate(getTodayKST());
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-xl"
                  >
                    일별
                  </button>
                </div>
              )}
            </div>

            {/* 날짜 선택 */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  type={viewType === 'monthly' ? 'month' : 'date'}
                  value={selectedDate}
                  onChange={handleDateChange}
                  disabled={viewType === 'all'}
                  className="flex-1 bg-transparent text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            {/* 타입 필터 버튼 */}
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${
                  selectedType === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedType('income')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${
                  selectedType === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                수입
              </button>
              <button
                onClick={() => setSelectedType('expense')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${
                  selectedType === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                지출
              </button>
            </div>
          </div>
        </div>

        {/* 거래 내역 리스트 */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {
            transactions.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium">표시할 거래 내역이 없습니다.</p>
                  <p className="text-sm text-gray-400">새 거래를 추가해보세요.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[...transactions].reverse().map((transaction) => {
                  const Icon = getIconByCategory(transaction.attributes.category);
                  return (
                    <div
                      key={transaction.id}
                      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                    >
                      <div className="flex items-center p-4 gap-4">
                        {/* 왼쪽: 아이콘 (모바일에서는 숨김) */}
                        <div className="hidden sm:block flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            transaction.attributes.type === 'income'
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : 'bg-red-50 dark:bg-red-900/20'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              transaction.attributes.type === 'income'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`} />
                          </div>
                        </div>

                        {/* 중앙: 정보 */}
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {/* 모바일에서만 보이는 작은 아이콘 */}
                            <div className="block sm:hidden">
                              <Icon className={`w-5 h-5 ${
                                transaction.attributes.type === 'income'
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`} />
                            </div>
                            <span className={`text-lg font-semibold tracking-tight ${
                              transaction.attributes.type === 'income'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {formatCurrency(transaction.attributes.amount)}
                            </span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {transaction.attributes.category}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {transaction.attributes.date}
                          </div>
                          {transaction.attributes.memo && (
                            <div className="text-sm text-gray-600 dark:text-gray-300 break-words leading-relaxed">
                              {transaction.attributes.memo}
                            </div>
                          )}
                        </div>

                        {/* 오른쪽: 버튼들 */}
                        <div className="flex-shrink-0 flex gap-1">
                          <button
                            onClick={() => router.push(`/transactions/${transaction.id}/edit`)}
                            className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="수정"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
} 