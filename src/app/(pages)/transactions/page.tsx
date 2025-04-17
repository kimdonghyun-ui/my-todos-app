'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Trash2, Pencil, ChevronDown } from 'lucide-react';
import { useTransactionStore } from '@/store/transactionStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { getTodayKST } from '@/utils/utils';

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
    if (user?.id) {
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


      fetchTransactions(filters);
    }
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* 필터 섹션 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* 드롭다운 버튼 */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
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
                <div className="absolute z-10 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <button
                    onClick={() => {
                      setViewType('all');
                      setSelectedDate('');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    전체
                  </button>
                  <button
                    onClick={() => {
                      setViewType('monthly');
                      setSelectedDate(getTodayKST('month'));
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    월별
                  </button>
                  <button
                    onClick={() => {
                      setViewType('daily');
                      setSelectedDate(getTodayKST());
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    일별
                  </button>
                </div>
              )}
            </div>

            {/* 날짜 선택 */}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <input
                type={viewType === 'monthly' ? 'month' : 'date'}
                value={selectedDate}
                onChange={handleDateChange}
                disabled={viewType === 'all'}
                className="rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* 타입 필터 */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedType('income')}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                수입
              </button>
              <button
                onClick={() => setSelectedType('expense')}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                지출
              </button>
            </div>
          </div>
        </div>

        {/* 거래 내역 리스트 */}
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          {
            transactions.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <p className="text-lg font-medium">표시할 거래 내역이 없습니다.</p>
                <p className="text-sm text-gray-400">새 거래를 추가해보세요.</p>
              </div>
            ) : (
              [...transactions].reverse().map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        transaction.attributes.type === 'income'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {formatCurrency(transaction.attributes.amount)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {transaction.attributes.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.attributes.date}
                  </div>
                  {transaction.attributes.memo && (
                    <div className="text-sm text-gray-600">
                      {transaction.attributes.memo}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/transactions/${transaction.id}/edit`)}
                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
} 