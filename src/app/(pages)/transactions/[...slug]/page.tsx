'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Calendar, Wallet, Tag, MessageSquare } from 'lucide-react';
import { useTransactionStore } from '@/store/transactionStore';
import { TransactionPostAttributes } from '@/types/transaction';
import { useAuthStore } from '@/store/authStore';
import { getTodayKST } from '@/utils/utils';
import { useParams } from 'next/navigation';

const expenseCategories = ['식비', '교통비', '쇼핑', '문화생활', '의료/건강', '교육', '주거비', '통신비', '보험', '기타'];
const incomeCategories = ['급여', '용돈', '투자수익', '환급', '기타'];

export default function TransactionFormPage() {
    // ##### url 파라미터로 등록/수정 페이지 구분 #####
    const params = useParams(); // 예) /transactions/new => { slug: ['new'] } 예2) /transactions/14/edit => { slug: ['14', 'edit'] }
    const slug = params.slug as string[];
    const [first, second] = slug || []; // 예) 등록이면 first = 'new', second = undefined // 예2) 수정이면 first = '14', second = 'edit'
    const isNew = first === 'new' && !second; // isNew = true → 등록 페이지
    const isEdit = !isNaN(Number(first)) && second === 'edit'; // isEdit = true → 수정 페이지
    const id = Number(first); // id = 등록모드일때는 NaN, 수정모드일때는 숫자(id 값 예)14)
    if (!isNew && !isEdit) { // 등록 = /transactions/new, 수정 = /transactions/14/edit 형식이 아니면 404 페이지 반환
      notFound();
    }
    // ##### //url 파라미터로 등록/수정 페이지 구분 #####


    const router = useRouter();
    const { user } = useAuthStore();
    const { fetchCreateTransaction, isLoading, fetchDetailTransaction, fetchUpdateTransaction } = useTransactionStore();

    const [formData, setFormData] = useState<TransactionPostAttributes>({
        type: 'expense',
        amount: 0,
        category: '',
        memo: '',
        date: getTodayKST(),
        users_permissions_user: user?.id?.toString() || '',
    });

    // 수정 모드일 경우 기존 데이터 불러오기
    useEffect(() => {
        if (!isEdit) { // 수정 모드 아닌경우 막기
            return;
        }

        // 수정 모드일 경우 기존 데이터 불러오기
        const fetchData = async () => {
            const res = await fetchDetailTransaction(id); // 기존 데이터 불러오기
            if (!res) {
                return;
            }
            const { type, amount, category, memo, date } = res
            setFormData({
                type,
                amount,
                category,
                memo,
                date,
                users_permissions_user: user?.id?.toString() || '',
            });
        };
        fetchData();

    }, [isEdit, id, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) { // 수정 모드일 경우
            await fetchUpdateTransaction(id, formData);
            router.push('/transactions');
        }else{ // 등록 모드일 경우 
            await fetchCreateTransaction(formData);
            router.push('/transactions');
        }
    };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? '거래 수정' : '새 거래 등록'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4" />날짜
          </label>
          <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Wallet className="h-4 w-4" />타입
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={() => setFormData({ ...formData, type: 'expense', category: '' })} className="h-4 w-4 text-red-500" />
              <span className="text-red-500">지출</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={() => setFormData({ ...formData, type: 'income', category: '' })} className="h-4 w-4 text-green-500" />
              <span className="text-green-500">수입</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Tag className="h-4 w-4" />카테고리
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:focus-visible:ring-gray-300"
            required
          >
            <option value="">카테고리를 선택하세요</option>
            {(formData.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Wallet className="h-4 w-4" />금액
          </label>
          <Input
            type="number"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            placeholder="금액을 입력하세요"
            required
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <MessageSquare className="h-4 w-4" />메모
          </label>
          <textarea
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
            placeholder="메모를 입력하세요 (선택)"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? '저장 중...' : '저장'}
        </button>
      </form>
    </div>
  );
}
