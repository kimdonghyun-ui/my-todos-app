'use client';

import { useState } from 'react';
import { useTodoStore } from '@/store/todoStore';
import { useAuthStore } from '@/store/authStore';

export default function TodoInput() {
  const [content, setContent] = useState('');
  const { addTodo, isLoading } = useTodoStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    try {
      await addTodo({
        content: content.trim(),
        isCompleted: false,
        userId: `${user?.id}`
      });
      setContent('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sticky top-0 bg-white dark:bg-gray-800 p-4 shadow-lg transition-colors duration-200">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="할 일을 입력하세요..."
        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                 dark:text-white transition-all duration-200"
        disabled={isLoading}
      />
    </form>
  );
} 