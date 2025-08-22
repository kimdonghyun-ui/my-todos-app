'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';
import { useTodoStore } from '@/store/todoStore';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { updateTodo, deleteTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(todo.attributes.content ?? '');
  const timeAgo = formatDistanceToNow(new Date(todo.attributes.createdAt), { addSuffix: true, locale: ko });


  // handleClickEditing = 마우스로 텍스트 클릭시 수정모드로 전환
  const handleEdit = () => {
    setIsEditing(true);
  };

  // handleKeyDown = 키를 눌렀을때 실행되는 함수(키보드 이벤트)
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { // Enter 키 누른경우에서만 실행(수정한 내용을 저장한다)
      setIsEditing(false);
      if (editedContent.trim() !== todo.attributes.content) {
        await updateTodo(todo.id, { content: editedContent.trim() });
      }
    } else if (e.key === 'Escape') { // Esc 키 누른경우에서만 실행(수정한 내용과 수정모드가 취소된다)
      setIsEditing(false);
      setEditedContent(todo.attributes.content);
    }
  };

  // handleBlur = 텍스트 입력창에서 포커스가 빠져질때 실행되는 함수
  const handleBlur = async () => {
    setIsEditing(false);
    if (editedContent.trim() !== todo.attributes.content) {
      await updateTodo(todo.id, { content: editedContent.trim() });
    }
  };

  return (
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
  layout
  className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm 
             hover:shadow-md transition-all duration-200"
>
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => updateTodo(todo.id, { isCompleted: !todo.attributes.isCompleted })}
          className="flex-shrink-0"
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                          transition-colors duration-200
                          ${todo.attributes.isCompleted 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300 dark:border-gray-600'}`}
          >
            {todo.attributes.isCompleted && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
            className="min-w-0 w-0 flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
                     dark:text-white"
          />
        ) : (
          <p 
          onClick={handleEdit}
            className={`flex-1 text-gray-800 dark:text-gray-200 transition-all duration-200
                      ${todo.attributes.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
          >
            {todo.attributes.content}
          </p>
        )}

        <button
          onClick={handleEdit}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                   dark:hover:text-gray-200"
          title="수정"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="opacity-70 group-hover:opacity-100 text-gray-400 cursor-pointer hover:text-red-500 
                     transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-2 dark:text-gray-500">
        {timeAgo}
      </p>
    </motion.div>
  );
} 