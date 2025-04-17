'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactionStore } from '@/store/transactionStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getTodayKST } from '@/utils/utils';

const COLORS = {
  income: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  expense: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
};

export default function StatisticsPage() {
  const { user } = useAuthStore();
  const { statistics, isLoading, error, fetchStatistics } = useTransactionStore();
  
  const [selectedMonth, setSelectedMonth] = useState<string>(getTodayKST('month'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchStatistics(user.id.toString(), selectedMonth);
    }
  }, [user?.id, selectedMonth, fetchStatistics]);

  // 월 선택 드롭다운 옵션 생성
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    for (let year = currentYear; year >= 2020; year--) {
      const startMonth = year === currentYear ? currentMonth : 12;
      for (let month = startMonth; month >= 1; month--) {
        const monthStr = month.toString().padStart(2, '0');
        options.push(`${year}-${monthStr}`);
      }
    }
    return options;
  };

  // 수입/지출 합계 계산
  const calculateTotals = () => {
    if (!statistics?.monthlyData) return { totalIncome: 0, totalExpense: 0 };

    return statistics.monthlyData.reduce(
      (acc, transaction) => {
        if (transaction.attributes.type === 'income') {
          acc.totalIncome += transaction.attributes.amount;
        } else {
          acc.totalExpense += transaction.attributes.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  };

  const { totalIncome, totalExpense } = calculateTotals();

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
        {/* 월 선택 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Calendar className="h-5 w-5" />
            <span>{selectedMonth}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {generateMonthOptions().map((month) => (
                <button
                  key={month}
                  onClick={() => {
                    setSelectedMonth(month);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 수입/지출 비율 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <TrendingDown className="h-5 w-5 text-red-500" />
              수입/지출 비율
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalIncome + totalExpense > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '수입', value: totalIncome },
                        { name: '지출', value: totalExpense },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">
                해당 월의 거래 내역이 없습니다.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 카테고리별 분석 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 수입 카테고리 Top 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-500">
                <TrendingUp className="h-5 w-5" />
                수입 카테고리 Top 5
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statistics?.incomeByCategory.length ? (
                <div className="space-y-2">
                  {statistics.incomeByCategory.map((item, index) => (
                    <div
                      key={item.category}
                      className="flex justify-between items-center p-2 rounded-lg"
                      style={{ backgroundColor: `${COLORS.income[index]}10` }}
                    >
                      <span className="font-medium">{item.category}</span>
                      <span className="text-green-500">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  수입 내역이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 지출 카테고리 Top 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <TrendingDown className="h-5 w-5" />
                지출 카테고리 Top 5
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statistics?.expenseByCategory.length ? (
                <div className="space-y-2">
                  {statistics.expenseByCategory.map((item, index) => (
                    <div
                      key={item.category}
                      className="flex justify-between items-center p-2 rounded-lg"
                      style={{ backgroundColor: `${COLORS.expense[index]}10` }}
                    >
                      <span className="font-medium">{item.category}</span>
                      <span className="text-red-500">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  지출 내역이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 