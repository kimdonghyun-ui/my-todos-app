'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTodoStore } from '@/store/todoStore';
import { useAuthStore } from '@/store/authStore';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos, fetchTodos, isLoading, error } = useTodoStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchTodos(`${user.id}`);
    }
  }, [fetchTodos,user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <AnimatePresence>
        {todos.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            할 일이 없습니다. 새로운 할 일을 추가해보세요!
          </div>
        ) : (
          todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </AnimatePresence>
    </div>
  );
} 