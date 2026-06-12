"use client";

import { useTransition } from "react";
import { toggleFormsEnabled } from "./actions";

export function SettingsToggle({ isEnabled }: { isEnabled: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      type="button" 
      onClick={() => {
        startTransition(async () => {
          await toggleFormsEnabled(isEnabled);
        });
      }}
      disabled={isPending}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${
        isEnabled ? "bg-emerald-500 shadow-sm shadow-emerald-500/20" : "bg-rose-500 shadow-sm shadow-rose-500/20"
      }`}
    >
      <span className="sr-only">Увімкнути/Вимкнути прийом анкет</span>
      <span 
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
          isEnabled ? "translate-x-2.5" : "-translate-x-2.5"
        }`} 
      />
    </button>
  );
}
