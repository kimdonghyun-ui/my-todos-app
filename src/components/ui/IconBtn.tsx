import React, { ReactElement, cloneElement, isValidElement } from "react";

export function IconBtn({
  onClick,
  icon,
  title,
}: {
  onClick: () => void;
  icon: ReactElement<{ className?: string }>; // 💡 여기!
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      title={title}
    >
      {isValidElement(icon) &&
        cloneElement(icon, {
          className: 'w-4 h-4 sm:w-5 sm:h-5',
        })}
    </button>
  );
}
