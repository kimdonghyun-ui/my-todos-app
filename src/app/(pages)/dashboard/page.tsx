'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownCircle, ArrowUpCircle, Calendar, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useTransactionStore } from '@/store/transactionStore';
import { useAuthStore } from '@/store/authStore';
import CountUp from 'react-countup';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { dashboardData, isLoading, error, fetchDashboardData } = useTransactionStore();

  useEffect(() => {
    if (!user?.id) return;
    fetchDashboardData(user?.id?.toString() || '');
  }, [fetchDashboardData, user]);

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
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘 수입</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp
                end={dashboardData?.todaySummary.totalIncome || 0}
                duration={1.5}
                separator=","
                formattingFn={(value) => `${formatCurrency(value)}원`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘 지출</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp
                end={dashboardData?.todaySummary.totalExpense || 0}
                duration={1.5}
                separator=","
                formattingFn={(value) => `${formatCurrency(value)}원`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘 잔액</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                (dashboardData?.todaySummary.balance ?? 0) < 0
                  ? 'text-red-500'
                  : 'text-blue-600 dark:text-blue-300'
              }`}
            >
              <CountUp
                end={dashboardData?.todaySummary.balance || 0}
                duration={1.5}
                separator=","
                formattingFn={(value) => `${formatCurrency(value)}원`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 자산</CardTitle>
            <Wallet className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                (dashboardData?.totalAssets ?? 0) < 0
                  ? 'text-red-500'
                  : 'text-purple-600 dark:text-purple-300'
              }`}
            >
              <CountUp
                end={dashboardData?.totalAssets || 0}
                duration={1.5}
                separator=","
                formattingFn={(value) => `${formatCurrency(value)}원`}
              />
            </div>
          </CardContent>
        </Card>



      </div>

      {/* 최근 거래 내역 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            최근 거래 내역
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData?.recentTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">거래 내역이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {dashboardData?.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 gap-2"
                >
                  {/* 아이콘 + 내용 */}
                  <div className="flex items-start gap-3 w-full sm:w-auto flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-full shrink-0 ${
                        transaction.attributes.type === 'income'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      {transaction.attributes.type === 'income' ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>

                    {/* 텍스트 내용 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {transaction.attributes.category}
                      </p>
                      <p className="text-sm text-gray-600 break-words whitespace-pre-line overflow-hidden">
                        {transaction.attributes.memo || '-'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {new Date(transaction.attributes.createdAt).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* 금액 */}
                  <div
                    className={`font-semibold text-right sm:text-left break-keep whitespace-nowrap ${
                      transaction.attributes.type === 'income'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {transaction.attributes.type === 'income' ? '+' : '-'}{' '}
                    {`${formatCurrency(transaction.attributes.amount, false)}원`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 