"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Send, AlertCircle, X } from "lucide-react";
import { sendTelegramMessage } from "@/app/actions";

const namesList = ["Дональд Трамп", "Володимир Зеленський", "Джо Байден", "Петро Порошенко", "Юлія Тимошенко"];
const domainsList = ["example.com", "gmail.com", "ukr.net", "outlook.com", "yahoo.com", "proton.me", "icloud.com"];

function useTypewriter(words: string[], baseString: string = "", typeSpeed = 100, deleteSpeed = 50, delayDuration = 2500) {
  const [text, setText] = useState(baseString + words[0]);

  useEffect(() => {
    let isMounted = true;
    let charIndex = words[0].length;
    let wordIndex = 0;
    let isDeleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const type = () => {
      if (!isMounted) return;
      const currentWord = words[wordIndex % words.length];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      setText(baseString + currentWord.substring(0, charIndex));

      let speed = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = delayDuration;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex++;
        speed = 500;
      }

      timer = setTimeout(type, speed);
    };

    timer = setTimeout(type, delayDuration);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [words, baseString, typeSpeed, deleteSpeed, delayDuration]);

  return text;
}

export function ContactSection() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("contactFormState");
      if (saved) {
        setFormState(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse form state", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("contactFormState", JSON.stringify(formState));
    } catch (e) {
      console.error("Failed to save form state", e);
    }
  }, [formState, isLoaded]);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  const namePlaceholder = useTypewriter(namesList);
  const emailPlaceholder = useTypewriter(domainsList, "name@");
  const messagePlaceholder = "Ваше повідомлення...";

  const showError = (msg: string) => {
    setErrorMessage(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setErrorMessage(null), 4000);
  };

  const showWarning = (msg: string) => {
    setWarningMessage(msg);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => setWarningMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitStatus === "submitting" || submitStatus === "success") return;

    const { name, email, message } = formState;

    if (!name.trim() || !email.trim() || !message.trim()) {
      showError("Будь ласка, заповніть всі обов'язкові поля.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Неправильний формат електронної пошти.");
      return;
    }

    setSubmitStatus("submitting");
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setErrorMessage(null);
    
    try {
      await sendTelegramMessage(formState);

      setSubmitStatus("success");
      setFormState({ name: "", email: "", message: "", honeypot: "" });
      localStorage.removeItem("contactFormState");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error: any) {
      console.error("Помилка відправки:", error);
      setSubmitStatus("error");
      showError(error.message || "Щось пішло не так при відправці.");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    }
  };

  return (
    <>
      <section id="contact" className="w-full max-w-4xl px-6 py-24 border-t border-border/20 flex flex-col items-center">
        <div className="text-center mb-12">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Зв'язатися зі мною
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-lg text-muted-foreground max-w-xl">
              Бажаєте обговорити проєкт або поставити запитання? Надішліть повідомлення, і я відповім вам найближчим часом.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.2} className="w-full max-w-lg">
          <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-[2rem] border border-border/60 bg-card/30 p-8 backdrop-blur-sm shadow-sm">
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
              <label htmlFor="website">Сайт</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={formState.honeypot}
                onChange={(e) => setFormState({ ...formState, honeypot: e.target.value })}
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Ім'я<span className="text-red-500 ml-1">*</span>
                </label>
                <span className={`text-xs ${formState.name.length >= 100 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {formState.name.length} / 100
                </span>
              </div>
              <input
                type="text"
                id="name"
                value={formState.name}
                maxLength={100}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length > 100) return;
                  if (val.length === 100 && formState.name.length < 100) {
                    showWarning("Досягнуто ліміт символів для імені.");
                  }
                  setFormState({ ...formState, name: val });
                }}
                className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground transition-all duration-300 placeholder-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={namePlaceholder}
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Електронна пошта<span className="text-red-500 ml-1">*</span>
                </label>
                <span className={`text-xs ${formState.email.length >= 200 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {formState.email.length} / 200
                </span>
              </div>
              <input
                type="email"
                id="email"
                value={formState.email}
                maxLength={200}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length > 200) return;
                  if (val.length === 200 && formState.email.length < 200) {
                    showWarning("Досягнуто ліміт символів для пошти.");
                  }
                  setFormState({ ...formState, email: val });
                }}
                className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground transition-all duration-300 placeholder-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={emailPlaceholder}
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label htmlFor="message" className="block text-sm font-medium text-foreground">
                  Повідомлення<span className="text-red-500 ml-1">*</span>
                </label>
                <span className={`text-xs ${formState.message.length >= 1200 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {formState.message.length} / 1200
                </span>
              </div>
              <textarea
                id="message"
                rows={4}
                value={formState.message}
                maxLength={1200}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length > 1200) return;
                  if (val.length === 1200 && formState.message.length < 1200) {
                    showWarning("Досягнуто ліміт символів для повідомлення (1200).");
                  }
                  setFormState({ ...formState, message: val });
                }}
                className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground transition-all duration-300 placeholder-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={messagePlaceholder}
              />
            </div>

            <div className="group w-full">
              <button
                type="submit"
                disabled={submitStatus === "submitting" || submitStatus === "success"}
                className={`w-full inline-flex items-center justify-center rounded-2xl px-6 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 active:scale-95 cursor-pointer ${
                  submitStatus === "success" 
                    ? "bg-emerald-600 shadow-emerald-600/20" 
                    : submitStatus === "error"
                    ? "bg-red-500 shadow-red-500/20"
                    : submitStatus === "submitting"
                    ? "bg-primary/70 shadow-primary/10 cursor-not-allowed"
                    : "bg-primary shadow-primary/20 group-hover:bg-primary/95 group-hover:shadow-primary/35 group-hover:-translate-y-1"
                }`}
              >
                {submitStatus === "success" ? (
                  "Повідомлення надіслано!"
                ) : submitStatus === "error" ? (
                  "Щось пішло не так..."
                ) : submitStatus === "submitting" ? (
                  "Надсилання..."
                ) : (
                  <>
                    <span className="transition-transform duration-300 group-hover:-translate-x-1">
                      Надіслати повідомлення
                    </span>
                    <Send className="ml-2 h-4 w-4 animate-fly" />
                  </>
                )}
              </button>
            </div>
          </form>
        </ScrollReveal>
      </section>

      {/* Toasts */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-24 right-6 z-50 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)}
              className="ml-2 text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {warningMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-40 right-6 z-50 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{warningMessage}</span>
            <button 
              onClick={() => setWarningMessage(null)}
              className="ml-2 text-amber-500/70 hover:text-amber-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
