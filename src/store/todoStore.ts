import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoResponse, TodoPostResponse } from '@/types/todo';
import { fetchApi } from '@/lib/fetchApi';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTodos: (userId: string) => Promise<void>;
  addTodo: (input: CreateTodoInput) => Promise<void>;
  updateTodo: (id: number, input: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      isLoading: false,
      error: null,

      fetchTodos: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetchApi<TodoResponse>(`/todos?filters[userId][$eq]=${userId}`, { method: 'GET' });
          set({
            todos: response.data.sort(
              (a, b) =>
                new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime()
            ),
          });
        } catch (error) {
          console.error('fetchTodos 에러 발생:', error);
          set({ error: '할 일 목록을 불러오는데 실패했습니다.' });
        } finally {
          set({ isLoading: false });
        }
      },

      addTodo: async (input: CreateTodoInput) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetchApi<TodoPostResponse>('/todos', {
            method: 'POST',
            body: JSON.stringify({ data: input }),
          });
          set((state) => ({
            todos: [response.data, ...state.todos],
          }));
        } catch (error) {
          console.error('addTodo 에러 발생:', error);
          set({ error: '할 일 추가에 실패했습니다.' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateTodo: async (id: number, input: UpdateTodoInput) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetchApi<TodoPostResponse>(`/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ data: input }),
          });
          set((state) => ({
            todos: state.todos.map((todo) => (todo.id === id ? response.data : todo)),
          }));
        } catch (error) {
          console.error('updateTodo 에러 발생:', error);
          set({ error: '할 일 수정에 실패했습니다.' });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteTodo: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await fetchApi(`/todos/${id}`, { method: 'DELETE' });
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          }));
        } catch (error) {
          console.error('deleteTodo 에러 발생:', error);
          set({ error: '할 일 삭제에 실패했습니다.' });
        } finally {
          set({ isLoading: false });
        }
      },

      setError: (error: string | null) => set({ error }),

      reset: () => {
        set({
          todos: [],
          isLoading: false,
          error: null,
        });
        useTodoStore.persist.clearStorage();
      },

    }),
    {
      name: 'todo-storage', // 로컬 스토리지에 저장될 키
    }
  )
);
