"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { MessageActions } from "./MessageActions";

interface Message {
  id: number;
  name: string;
  gmail: string;
  message: string;
  saw: boolean;
  created_at: string;
}

export function MessagesList({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("contact_messages_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        (payload) => {
          console.log("Realtime message update:", payload);
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [payload.new as Message, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.new.id ? (payload.new as Message) : msg))
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (!messages || messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground bg-card rounded-2xl p-12 text-center border border-border/50"
      >
        Немає нових повідомлень.
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-2xl border transition-colors duration-300 ${
              msg.saw
                ? "bg-background border-border opacity-60 hover:opacity-100"
                : "bg-primary/5 border-primary/20 shadow-sm"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="w-full sm:w-auto min-w-0 overflow-hidden">
                <h3 className="font-semibold text-xl tracking-tight text-foreground truncate">{msg.name}</h3>
                <a
                  href={`mailto:${msg.gmail}`}
                  className="text-sm text-primary hover:underline transition-colors duration-300 block truncate"
                >
                  {msg.gmail}
                </a>
              </div>

              <div className="flex w-full sm:w-auto justify-end shrink-0">
                <MessageActions id={msg.id} saw={msg.saw} />
              </div>
            </div>

            <div className="mt-4 p-5 bg-muted rounded-xl whitespace-pre-wrap text-[15px] leading-relaxed text-foreground border border-border/50 shadow-inner">
              {msg.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
