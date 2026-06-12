"use client";

import { useTransition } from "react";
import { toggleMessageSaw, deleteMessage } from "./actions";
import { Eye, EyeOff, Trash2 } from "lucide-react";

export function MessageActions({ id, saw }: { id: number | string, saw: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => {
          startTransition(async () => {
            await toggleMessageSaw(id, saw);
          });
        }}
        disabled={isPending}
        className={`group inline-flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 ${
          saw
            ? "bg-secondary/80 hover:bg-secondary border border-border/50 text-secondary-foreground shadow-sm hover:shadow"
            : "bg-primary/90 hover:bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
        }`}
        title={saw ? "Позначити як нове" : "Позначити як прочитане"}
      >
        {saw ? (
          <EyeOff className="w-4 h-4 transition-transform group-hover:scale-110" />
        ) : (
          <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
        )}
      </button>
      
      <button 
        onClick={() => {
          if (confirm("Видалити це повідомлення назавжди?")) {
            startTransition(async () => {
              await deleteMessage(id);
            });
          }
        }}
        disabled={isPending}
        className="group inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 active:scale-95 shadow-sm hover:shadow-lg hover:shadow-destructive/20 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-12" />
        <span className="hidden sm:inline">Видалити</span>
      </button>
    </div>
  );
}
