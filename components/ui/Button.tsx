import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "px-4 py-2 rounded-md shadow-sm font-medium focus:outline-none disabled:opacity-50";
  const style =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-transparent text-blue-500";

  return <button className={`${base} ${style} ${className}`} {...props} />;
}
