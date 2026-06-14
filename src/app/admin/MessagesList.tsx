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
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "3days" | "7days">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "seen" | "unseen">("all");
  
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

  const filteredMessages = messages.filter(msg => {
    if (statusFilter === "seen" && !msg.saw) return false;
    if (statusFilter === "unseen" && msg.saw) return false;

    if (dateFilter === "all") return true;
    
    // Якщо дата відсутня, вважаємо повідомлення дуже старим (щоб воно не попадало в нові фільтри)
    if (!msg.created_at) return false;
    
    const msgDate = new Date(msg.created_at);
    if (isNaN(msgDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === "today") {
      return msgDate >= today;
    }
    
    if (dateFilter === "3days") {
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(today.getDate() - 2); // сьогодні, вчора, позавчора
      return msgDate >= threeDaysAgo;
    }
    
    if (dateFilter === "7days") {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      return msgDate >= sevenDaysAgo;
    }
    
    return true;
  }).sort((a, b) => {
    const timeA = new Date(a.created_at || 0).getTime();
    const timeB = new Date(b.created_at || 0).getTime();
    return timeB - timeA;
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-card p-4 rounded-2xl border border-border/50 gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-sm font-medium text-foreground">Статус:</span>
          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as "all" | "seen" | "unseen")}
              className="appearance-none bg-background border border-border rounded-lg pl-4 pr-10 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer w-full"
            >
              <option value="all">Усі</option>
              <option value="unseen">Непрочитані</option>
              <option value="seen">Прочитані</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-sm font-medium text-foreground">За датою:</span>
          <div className="relative">
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value as "all" | "today" | "3days" | "7days")}
              className="appearance-none bg-background border border-border rounded-lg pl-4 pr-10 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer w-full"
            >
              <option value="all">За весь час</option>
              <option value="today">За сьогодні</option>
              <option value="3days">Останні 3 дні</option>
              <option value="7days">Останній тиждень</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredMessages.map((msg) => (
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
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-xl tracking-tight text-foreground truncate">{msg.name}</h3>
                  {msg.created_at && !isNaN(new Date(msg.created_at).getTime()) && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      {" о "}
                      {new Date(msg.created_at).toLocaleString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
                <a
                  href={`mailto:${msg.gmail}`}
                  className="text-sm text-primary hover:underline transition-colors duration-300 block truncate mt-1"
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
        {filteredMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground p-8 text-center"
          >
            За вибраними фільтрами повідомлень не знайдено.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
