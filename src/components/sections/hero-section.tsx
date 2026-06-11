"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, Zap, Server, Shield, Code, ArrowRight, Mail } from "lucide-react";
import React, { useState, useEffect } from "react";

const heroTags = [
  { text: "Створюю преміальних ботів", icon: Bot },
  { text: "Створюю швидкі веб-додатки", icon: Zap },
  { text: "Пишу надійний бекенд", icon: Server },
  { text: "Створюю захищені сайти", icon: Shield },
  { text: "Автоматизую рутину", icon: Code },
];

function HeroTagsSlider() {
  const [currentTagIndex, setCurrentTagIndex] = useState(0);

  useEffect(() => {
    const tagInterval = setInterval(() => {
      setCurrentTagIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(tagInterval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl h-12 mb-6 flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <AnimatePresence>
        {[-1, 0, 1].map((offset) => {
          const absoluteIndex = currentTagIndex + offset;
          const wrappedIndex = ((absoluteIndex % heroTags.length) + heroTags.length) % heroTags.length;
          const item = heroTags[wrappedIndex];
          const Icon = item.icon;

          return (
            <motion.div
              key={absoluteIndex}
              initial={{ opacity: 0, x: (offset + 1) * 280, scale: 0.7 }}
              animate={{ 
                opacity: offset === 0 ? 1 : 0.4, 
                x: offset * 280, 
                scale: offset === 0 ? 1 : 0.85,
                zIndex: offset === 0 ? 10 : 5
              }}
              exit={{ opacity: 0, x: (offset - 1) * 280, scale: 0.7 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 w-0 h-0 flex items-center justify-center"
            >
              <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-primary whitespace-nowrap shadow-sm bg-background/50 backdrop-blur-md">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.text}</span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="hero" className="w-full min-h-screen flex items-center justify-center relative px-6 pt-24 overflow-hidden">
      {/* Subtle background glow */}
      <div className="hidden md:block absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl w-full text-center z-10 flex flex-col items-center">
        
        {/* Tagline */}
        <HeroTagsSlider />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(1.25rem,3.5vw,4rem)] font-extrabold tracking-tight leading-none mb-6 relative w-full"
        >
          Маленький крок для людини.<br />
          <motion.span 
            animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto]"
          >
            Великий крок для людства.
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed"
        >
          Привіт, мене звати Артур. Я розробник-початківець, що спеціалізується на створенні Discord / Telegram ботів та швидких і інтерактивних додатків.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <div className="group w-full sm:w-auto">
            <a
              href="#projects"
              className="w-full inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:bg-primary/95 group-hover:shadow-primary/35 group-hover:-translate-y-1 active:scale-95 cursor-pointer"
            >
              Мої проєкти
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </div>
          <div className="group w-full sm:w-auto">
            <a
              href="#contact"
              className="w-full inline-flex items-center justify-center rounded-2xl border border-border bg-card/50 px-8 py-4 text-sm font-semibold text-foreground transition-all duration-300 group-hover:bg-secondary/50 group-hover:-translate-y-1 active:scale-95 cursor-pointer"
            >
              <Mail className="mr-2 h-4 w-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-12 group-hover:text-primary" />
              Зв'язатися
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
