"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function sendTelegramMessage(formData: { name: string; email: string; message: string; honeypot?: string; startTime?: number }) {
  // 1. Honeypot check: If the hidden field is filled out, reject the request (bots fill this out)
  if (formData.honeypot) {
    console.log("Honeypot filled, rejecting request.");
    return { success: true }; // Pretend it succeeded
  }

  const now = Date.now();

  // 2. Time-to-fill validation (reject if < 3 seconds)
  if (formData.startTime) {
    if (now - formData.startTime < 3000) {
      console.log("Form filled too fast, rejecting request.");
      return { success: true }; // Silent reject
    }
  }

  // 3. Input validation
  const name = formData.name?.trim() || "";
  const email = formData.email?.trim() || "";
  const message = formData.message?.trim() || "";

  if (!name || name.length > 100) return { error: "Недійсне ім'я" };
  if (!email || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Недійсний формат пошти" };
  if (!message || message.length > 2000) return { error: "Повідомлення занадто довге" };

  // 4. URL Spam check
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = message.match(urlRegex);
  if (urls && urls.length > 2) {
     return { error: "Повідомлення містить забагато посилань." };
  }

  const supabase = await createClient();

  // 5. Database IP Rate Limiting
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown-ip";
  const windowMs = 30 * 60 * 1000; // 30 minutes
  const maxRequests = 3;

  const { data: rateData } = await supabase
    .from("rate_limits")
    .select("*")
    .eq("ip", ip)
    .single();

  if (rateData) {
    const lastRequest = new Date(rateData.last_request).getTime();
    if (now - lastRequest > windowMs) {
      // Reset window
      await supabase
        .from("rate_limits")
        .update({ request_count: 1, last_request: new Date(now).toISOString() })
        .eq("ip", ip);
    } else {
      if (rateData.request_count >= maxRequests) {
        return { error: "Занадто багато запитів. Будь ласка, зачекайте 30 хвилин." };
      }
      // Increment
      await supabase
        .from("rate_limits")
        .update({ request_count: rateData.request_count + 1, last_request: new Date(now).toISOString() })
        .eq("ip", ip);
    }
  } else {
    // New IP entry
    await supabase
      .from("rate_limits")
      .insert([{ ip, request_count: 1, last_request: new Date(now).toISOString() }]);
  }

  // 6. Check if forms are enabled globally
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
