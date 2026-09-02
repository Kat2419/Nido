"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";

export function SubmitButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-2.5 font-semibold text-cream shadow-sm transition hover:bg-terracotta-dark disabled:opacity-60 ${className}`}
      {...props}
    >
      {pending ? "Un momento..." : children}
    </button>
  );
}
