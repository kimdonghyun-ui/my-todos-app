import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';

export default function HomePage() {
  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <main className="h-full max-w-2xl mx-auto px-4 pt-8 pb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">할 일 목록</h2>
            <p className="text-gray-600 dark:text-gray-400">오늘의 할 일을 관리해보세요</p>
          </div>
          <TodoInput />
          <div className="mt-8 h-[calc(100%-210px)] overflow-auto">
            <TodoList />
          </div>
        </div>
      </main>
    </div>
  );
}
