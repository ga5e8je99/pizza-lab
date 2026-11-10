"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const translations = {
  ar: {
    dir: "rtl",
    isRTL: true,
    brand: "بيتزا هاوس",
    since: "منذ 1995",
    home: "الرئيسية",
    menu: "القائمة",
    about: "من نحن",
    contact: "تواصل معنا",
    search: "بحث",
    signIn: "تسجيل الدخول",
    register: "إنشاء حساب",
    orderNow: "اطلب الآن",
    todaySpecials: "عروض اليوم",
    offerCode: "خصم 20% على جميع البيتزا! الكود: PIZZA20",
    viewOffers: "عرض العروض",
    popular: "الأكثر طلباً",
    starting: "يبدأ من",
    viewFullMenu: "عرض القائمة الكاملة",
    newItems: "جديدنا",
    mostPopular: "الأكثر شعبية",
    cart: "السلة",
    wishlist: "المفضلة",
    offers: "العروض",
    callUs: "اتصل بنا",
    findUs: "موقعنا",
    locations: "3 فروع",
    openUntil: "مفتوح حتى الساعة 11 مساءً",
    createAccount: "إنشاء حساب",
    allDay: "24/7",
    categories: [
      { name: "بيتزا", description: "طازجة يومياً، أكثر من 30 إضافة", price: "12.99$+" },
      { name: "مشروبات", description: "مشروبات منعشة، باردة وساخنة", price: "2.99$+" },
      { name: "حلويات", description: "حلويات لذيذة، منزلية الصنع", price: "5.99$+" },
      { name: "كل الأصناف", description: "عرض القائمة الكاملة" },
    ],

    // Hero Section (100% Arabic)
    hero: {
      badge: "أفضل بيتزا إيطالية طازجة يومياً",
      titlePrefix: "بيتزا هاوس",
      titleHighlight: "الساخنة",
      subtitlePrefix: "أسرع خدمة",
      subtitleHighlight: "توصيل طازج",
      description: "استمتع بأشهى أنواع البيتزا المخبوزة على الحجر بأجود المكونات الطازجة، وتصلك ساخنة ومقرمشة حتى باب منزلك في أسرع وقت.",
      orderBtn: "اطلب الآن",
      menuBtn: "استكشف القائمة",
      branchesBtn: "الفروع والتوصيل",
      statItems: "+30",
      statItemsLabel: "صنف طازج ومميز",
      statTime: "30 دقيقة",
      statTimeLabel: "توصيل سريع ومضمون",
      statRating: "4.9 / 5",
      statRatingLabel: "تقييم آلاف الزبائن",
      pizzas: [
        { name: "بيبروني سوبريم", desc: "لحم بقري فاخر وجبنة موتزاريلا ذائبة", tag: "الأكثر طلباً" },
        { name: "مارجريتا الأصلية", desc: "صلصة إيطالية كلاسيكية وريحان طازج", tag: "كلاسيك" },
        { name: "دجاج باربيكيو", desc: "دجاج مشوي مع صوص باربيكيو مدخن", tag: "مميز" },
      ],
      floatingOven: "مخبوزة بفرن حجري 400°C",
      floatingCheese: "100% جبنة طبيعية طازجة",
      floatingFast: "توصيل ساخن في 30 دقيقة",
    },
  },

  en: {
    dir: "ltr",
    isRTL: false,
    brand: "PizzaHouse",
    since: "Since 1995",
    home: "Home",
    menu: "Menu",
    about: "About Us",
    contact: "Contact",
    search: "Search",
    signIn: "Sign In",
    register: "Register",
    orderNow: "Order Now",
    todaySpecials: "Today's Specials",
    offerCode: "20% off on all pizzas! Use code: PIZZA20",
    viewOffers: "View Offers",
    popular: "Popular",
    starting: "Starting",
    viewFullMenu: "View Full Menu",
    newItems: "New Items",
    mostPopular: "Most Popular",
    cart: "Cart",
    wishlist: "Wishlist",
    offers: "Offers",
    callUs: "Call Us",
    findUs: "Find Us",
    locations: "3 locations",
    openUntil: "Open until 11:00 PM",
    createAccount: "Create Account",
    allDay: "24/7",
    categories: [
      { name: "Pizza", description: "Freshly baked, 30+ toppings", price: "$12.99+" },
      { name: "Drinks", description: "Refreshing beverages, cold & hot", price: "$2.99+" },
      { name: "Desserts", description: "Sweet treats, homemade", price: "$5.99+" },
      { name: "All Items", description: "View full menu" },
    ],

    // Hero Section (100% English)
    hero: {
      badge: "Authentic Italian Pizza Daily",
      titlePrefix: "Hot Pizza",
      titleHighlight: "House",
      subtitlePrefix: "Fast Gourmet",
      subtitleHighlight: "Delivery Service",
      description: "Experience authentic stone-baked gourmet pizzas crafted with the freshest ingredients, delivered hot and crispy straight to your doorstep.",
      orderBtn: "Order Now",
      menuBtn: "Explore Menu",
      branchesBtn: "Branches & Delivery",
      statItems: "30+",
      statItemsLabel: "Signature Dishes",
      statTime: "30 Mins",
      statTimeLabel: "Fast Guaranteed Delivery",
      statRating: "4.9 / 5",
      statRatingLabel: "Customer Satisfaction",
      pizzas: [
        { name: "Pepperoni Supreme", desc: "Savory beef pepperoni & bubbling mozzarella", tag: "Bestseller" },
        { name: "Classic Margherita", desc: "San Marzano sauce & fresh aromatic basil", tag: "Classic" },
        { name: "BBQ Chicken Feast", desc: "Tender grilled chicken & smoky rich glaze", tag: "Special" },
      ],
      floatingOven: "Stone Baked at 400°C",
      floatingCheese: "100% Fresh Mozzarella",
      floatingFast: "Hot Delivery in 30 Mins",
    },
  },
};

const LanguageContext = createContext({
  lang: "ar",
  isRTL: true,
  t: translations.ar,
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("ar");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("site_lang");
      if (stored === "en" || stored === "ar") {
        setLangState(stored);
      } else {
        setLangState("ar");
        localStorage.setItem("site_lang", "ar");
      }
    } catch {
      setLangState("ar");
    }
  }, []);

  const setLang = useCallback((newLang) => {
    const valid = newLang === "en" ? "en" : "ar";
    setLangState(valid);
    try {
      localStorage.setItem("site_lang", valid);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.dir = translations[valid].dir;
      document.documentElement.lang = valid;
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "ar" ? "en" : "ar");
  }, [lang, setLang]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const activeTrans = translations[lang] || translations.ar;
      document.documentElement.dir = activeTrans.dir;
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const activeTrans = translations[lang] || translations.ar;

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isRTL: activeTrans.isRTL,
        t: activeTrans,
        setLang,
        toggleLang,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "ar",
      isRTL: true,
      t: translations.ar,
      setLang: () => {},
      toggleLang: () => {},
    };
  }
  return ctx;
}

