"use server";

import { headers } from "next/headers";

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

  if (!name || name.length > 100) throw new Error("Invalid name length");
  if (!email || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email format");
  if (!message || message.length > 2000) throw new Error("Message is too long");

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
    throw new Error("Занадто багато запитів. Будь ласка, зачекайте 10 хвилин.");
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram configuration is missing in environment variables.");
  }

  const text = `🔔 <b>Нове повідомлення!</b>\n\n👤 <b>Ім'я:</b> ${name}\n📧 <b>Пошта:</b> ${email}\n\n📝 <b>Повідомлення:</b>\n${message}`;

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
    throw new Error(`Telegram API error: ${response.statusText}`);
  }

  return { success: true };
}
