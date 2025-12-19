import React from "react";

type Props = {
  title: string;
  content: string;
  updatedAt?: string;
  onClick?: () => void;
};

export default function NoteCard({ title, content, updatedAt, onClick }: Props) {
  return (
    <article
      onClick={onClick}
      className="bg-white dark:bg-[#0b0b0b] rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md transition w-full"
      dir="rtl"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{title}</h3>
        {updatedAt && (
          <time className="text-xs text-gray-500">{updatedAt}</time>
        )}
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">{content}</p>
    </article>
  );
}
