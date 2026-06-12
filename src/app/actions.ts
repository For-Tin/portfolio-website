"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// Simple in-memory rate limiting map
// Maps IP to { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function sendTelegramMessage(formData: { name: string; email: string; message: string; honeypot?: string }) {
  // 1. Honeypot check: If the hidden field is filled out, reject the request (bots fill this out)
  if (formData.honeypot) {
    console.log("Honeypot filled, rejecting request.");
    return { success: true }; // Pretend it succeeded
  }

  // 2. Input validation
  const name = formData.name?.trim() || "";
  const email = formData.email?.trim() || "";
  const message = formData.message?.trim() || "";

  if (!name || name.length > 100) return { error: "Недійсне ім'я" };
  if (!email || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Недійсний формат пошти" };
  if (!message || message.length > 2000) return { error: "Повідомлення занадто довге" };

  // 3. IP Rate Limiting
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown-ip";
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 3;

  let limitData = rateLimitMap.get(ip);
  if (!limitData || limitData.resetTime < now) {
    limitData = { count: 1, resetTime: now + windowMs };
  } else {
    limitData.count++;
  }
  rateLimitMap.set(ip, limitData);

  if (limitData.count > maxRequests) {
    return { error: "Занадто багато запитів. Будь ласка, зачекайте 10 хвилин." };
  }

  // 4. Check if forms are enabled globally
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "forms_enabled")
    .single();

  if (settings && settings.value === "false") {
    return { error: "Прийом нових повідомлень тимчасово призупинено." };
  }

  // 5. Save to Supabase
  const { error: dbError } = await supabase
    .from("contact_messages")
    .insert([
      { name, gmail: email, message, saw: false }
    ]);

  if (dbError) {
    console.error("Supabase API Error:", dbError);
    // We continue execution to at least send the Telegram message even if DB fails
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram configuration is missing in environment variables.");
    return { error: "Внутрішня помилка сервера. Спробуйте пізніше." };
  }

  // HTML escape function to prevent Telegram API parsing errors
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const text = `🔔 <b>Нове повідомлення!</b>\n\n👤 <b>Ім'я:</b> ${escapeHtml(name)}\n📧 <b>Пошта:</b> ${escapeHtml(email)}\n\n📝 <b>Повідомлення:</b>\n${escapeHtml(message)}`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Telegram API Error:", errorData);
    return { error: "Помилка відправки повідомлення в Telegram." };
  }

  return { success: true };
}
