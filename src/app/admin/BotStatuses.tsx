"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

interface BotStatus {
  id: number;
  bot_name: string;
  last_active: string;
}

const BotBadge = ({ isOnline }: { isOnline: boolean }) => {
  return (
    <AnimatePresence mode="wait">
      {isOnline ? (
        <motion.span 
          key="online"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/20 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Online
        </motion.span>
      ) : (
        <motion.span 
          key="offline"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 text-sm font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-500/20 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          Офлайн
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export function BotStatuses({ initialBotsData }: { initialBotsData: BotStatus[] }) {
  const [botsData, setBotsData] = useState<BotStatus[]>(initialBotsData);
  const [now, setNow] = useState(new Date().getTime());

  const supabase = createClient();

  useEffect(() => {
    // Оновлюємо поточний час щохвилини, щоб статуси перераховувалися локально
    const interval = setInterval(() => {
      setNow(new Date().getTime());
    }, 60000);

    const channel = supabase
      .channel("bot_status_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bot_status",
        },
        (payload) => {
          const updatedBot = payload.new as BotStatus;
          setBotsData((prev) =>
            prev.map((bot) => (bot.bot_name === updatedBot.bot_name ? updatedBot : bot))
          );
          setNow(new Date().getTime()); // Оновлюємо час одразу при отриманні пінгу
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const telegramBot = botsData.find((b) => b.bot_name === "telegram");
  const discordBot = botsData.find((b) => b.bot_name === "discord");

  const isOnline = (lastActiveStr: string | undefined) => {
    if (!lastActiveStr) return false;
    const lastActive = new Date(lastActiveStr).getTime();
    return now - lastActive < 2 * 60 * 1000;
  };

  const tgOnline = isOnline(telegramBot?.last_active);
  const dcOnline = isOnline(discordBot?.last_active);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-muted-foreground font-medium">
          <Bot className="w-4 h-4" /> Telegram
        </span>
        <BotBadge isOnline={tgOnline} />
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-muted-foreground font-medium">
          <Bot className="w-4 h-4" /> Discord
        </span>
        <BotBadge isOnline={dcOnline} />
      </div>
    </div>
  );
}
