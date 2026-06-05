"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTilt({ children, className = "" }: CardTiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion-переменные для отслеживания координат
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Добавление плавности с помощью spring-анимации
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });

  // Преобразование координат мыши в углы наклона (до 10 градусов)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  // Состояние ховера и координаты для светового блика
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Нормализуем координаты от -0.5 до 0.5
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);

    setSpotlightPos({ x: mouseX, y: mouseY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full h-full"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full h-full rounded-[2rem] border border-border/80 bg-card/60 p-8 shadow-sm overflow-hidden transition-colors duration-500 backdrop-blur-sm ${className}`}
      >
        {/* Интерактивный световой блик (Spotlight) */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.08 : 0,
            background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, var(--primary), transparent 75%)`,
          }}
        />

        {/* Обёртка контента с эффектом 3D-выталкивания */}
        <div style={{ transform: "translateZ(30px)" }} className="relative h-full flex flex-col">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
