

import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Todo List
          </h1>
          <DarkModeToggle />
        </header>
        <main>
          <TodoInput />
          <TodoList />
        </main>
      </div>
    </div>
  );
}
