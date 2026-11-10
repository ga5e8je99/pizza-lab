"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Wave from "./Wave";
import { useLanguage } from "../Context/LanguageContext";
import {
  ShoppingBag,
  Sparkles,
  Clock,
  Flame,
  ArrowRight,
  ArrowLeft,
  Star,
  CheckCircle2,
  UtensilsCrossed,
} from "lucide-react";

const HERO_PIZZAS = [
  {
    id: 0,
    image: "/offer1.png",
    nameAr: "بيبروني سوبريم",
    nameEn: "Pepperoni Supreme",
    badgeAr: "الأكثر طلباً",
    badgeEn: "Bestseller",
    price: "140 EGP",
  },
  {
    id: 1,
    image: "/homeImage.png",
    nameAr: "مارجريتا الأصلية",
    nameEn: "Classic Margherita",
    badgeAr: "كلاسيك إيطالي",
    badgeEn: "Classic Italian",
    price: "110 EGP",
  },
  {
    id: 2,
    image: "/offer4.png",
    nameAr: "دجاج باربيكيو",
    nameEn: "BBQ Chicken Feast",
    badgeAr: "مذاق مميز",
    badgeEn: "Chef Special",
    price: "145 EGP",
  },
];

export default function Hero() {
  const { lang, isRTL, t } = useLanguage();
  const heroT = t.hero;

  const [activePizzaIndex, setActivePizzaIndex] = useState(0);
  const activePizza = HERO_PIZZAS[activePizzaIndex];

  // Auto rotate pizzas every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePizzaIndex((prev) => (prev + 1) % HERO_PIZZAS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 px-4 sm:px-8 md:px-12 lg:px-20 pt-24 pb-20 select-none"
    >
      {/* Subtle Dot Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient Lighting Orbs */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-red-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[440px] h-[440px] bg-amber-300/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-orange-600/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-20 container mx-auto flex flex-col-reverse items-center justify-between gap-12 lg:gap-16 lg:flex-row">

        {/* ========================================================
            TEXT & CTA COLUMN
        ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`w-full lg:w-1/2 space-y-6 ${isRTL ? "text-center lg:text-right" : "text-center lg:text-left"
            }`}
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-950/15 border border-neutral-950/15 backdrop-blur-md shadow-sm">
            <Flame className="w-4 h-4 text-red-700 animate-pulse" />
            <span className="text-xs sm:text-sm font-black tracking-wide text-neutral-950">
              {heroT.badge}
            </span>
          </div>

          {/* Main Titles */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-[1.15]">
              {heroT.titlePrefix}{" "}
              <span className="text-red-700 drop-shadow-sm">
                {heroT.titleHighlight}
              </span>
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              {heroT.subtitlePrefix}{" "}
              <span className="text-red-700">
                {heroT.subtitleHighlight}
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="max-w-xl text-base sm:text-lg font-medium text-neutral-950/85 leading-relaxed">
            {heroT.description}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap items-center gap-4 pt-2 ${isRTL
              ? "justify-center lg:justify-start"
              : "justify-center lg:justify-start"
              }`}
          >
            {/* Primary Order Button */}
            <Link
              href="/menu"
              className="inline-flex items-center gap-2.5 px-8 py-4 font-black text-white transition-all bg-gradient-to-r from-red-600 via-red-600 to-red-700 rounded-2xl shadow-xl shadow-red-900/30 hover:shadow-2xl hover:shadow-red-900/40 hover:scale-[1.03] active:scale-[0.98] text-base group"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>{heroT.orderBtn}</span>
            </Link>

            {/* Secondary Explore Menu Button */}
            <Link
              href="/order"
              className="inline-flex items-center gap-2 px-7 py-4 font-bold text-neutral-950 transition-all bg-white/25 hover:bg-white/40 backdrop-blur-md border border-neutral-950/15 rounded-2xl hover:scale-[1.02] active:scale-[0.98] text-base"
            >
              <span>{heroT.branchesBtn}</span>
              {isRTL ? (
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          </div>

          {/* Stats Badges (3 Glassmorphism Cards) */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-950/15">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-950/10 border border-neutral-950/10 backdrop-blur-xs">
              <span className="text-xl sm:text-2xl font-black text-neutral-950">
                {heroT.statItems}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-neutral-900/80 text-center">
                {heroT.statItemsLabel}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-950/10 border border-neutral-950/10 backdrop-blur-xs">
              <span className="text-xl sm:text-2xl font-black text-neutral-950">
                {heroT.statTime}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-neutral-900/80 text-center">
                {heroT.statTimeLabel}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-950/10 border border-neutral-950/10 backdrop-blur-xs">
              <span className="text-xl sm:text-2xl font-black text-neutral-950">
                {heroT.statRating}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-neutral-900/80 text-center">
                {heroT.statRatingLabel}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            PIZZA SHOWCASE COLUMN
        ======================================================== */}
        <div className="relative flex flex-col items-center justify-center w-full lg:w-1/2">

          {/* Main Visual Stage */}
          <div className="relative w-[300px] sm:w-[400px] md:w-[460px] h-[300px] sm:h-[400px] md:h-[460px] flex items-center justify-center">

            {/* Pulsing Warm Radial Aura */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.85, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300/40 via-red-600/30 to-amber-200/20 blur-3xl pointer-events-none"
            />

            {/* Glowing Floor Plate */}
            <div className="absolute bottom-6 w-[80%] h-12 bg-neutral-950/30 rounded-[100%] blur-xl pointer-events-none" />

            {/* Floating Gourmet Pizza */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePizza.id}
                initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  y: [0, -12, 0],
                }}
                exit={{ opacity: 0, scale: 0.85, rotate: 15 }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.5, ease: "easeOut" },
                  rotate: { duration: 0.5, ease: "easeOut" },
                  y: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer group"
                onClick={() =>
                  setActivePizzaIndex((prev) => (prev + 1) % HERO_PIZZAS.length)
                }
              >
                <Image
                  src={activePizza.image}
                  width={520}
                  height={520}
                  alt={isRTL ? activePizza.nameAr : activePizza.nameEn}
                  priority
                  unoptimized
                  className="w-full h-full object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            </AnimatePresence>

            {/* Floating Feature Pill 1 (Top Corner) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute top-4 ${isRTL ? "-left-2 sm:left-2" : "-right-2 sm:right-2"
                } z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950/80 text-white backdrop-blur-md border border-yellow-500/40 shadow-xl text-xs font-bold`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{heroT.floatingOven}</span>
            </motion.div>

            {/* Floating Feature Pill 2 (Bottom Corner) */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className={`absolute bottom-8 ${isRTL ? "-right-2 sm:right-2" : "-left-2 sm:left-2"
                } z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950/80 text-white backdrop-blur-md border border-amber-500/30 shadow-xl text-xs font-bold`}
            >
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>{heroT.floatingFast}</span>
            </motion.div>
          </div>


        </div>
      </div>

      {/* Smooth Curved Wave Divider at Bottom */}
      <div className="absolute left-0 right-0 -bottom-1 w-full z-30 pointer-events-none">
        <Wave color="#121212" />
      </div>
    </section>
  );
}
