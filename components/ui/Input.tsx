import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, className = "", ...props }: Props) {
  return (
    <label className="flex flex-col text-sm w-full" dir="rtl">
      {label && <span className="mb-1 text-gray-600 dark:text-gray-300">{label}</span>}
      <input
        {...props}
        className={
          "px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm " +
          className
        }
      />
    </label>
  );
}
