"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../Context/CartContext";

import {
  Pizza,
  GlassWater,
  LogIn,
  Menu,
  ShoppingCart,
  User,
  ChefHat,
  Coffee,
  Cake,
  ArrowRight,
  Phone,
  Clock,
  MapPin,
  Star,
  Sparkles,
  Home,
  Info,
  Mail,
  Utensils,
  X,
  ShoppingBag,
  Heart,
  Search,
  Globe,
} from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

// =============== الترجمات ===============
const translations = {
  en: {
    dir: "ltr",
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
    openUntil: "🕒 Open until 11:00 PM",
    createAccount: "Create Account",
    allDay: "24/7",
    categories: [
      {
        name: "Pizza",
        description: "Freshly baked, 30+ toppings",
        price: "$12.99+",
      },
      {
        name: "Drinks",
        description: "Refreshing beverages, cold & hot",
        price: "$2.99+",
      },
      {
        name: "Desserts",
        description: "Sweet treats, homemade",
        price: "$5.99+",
      },
      { name: "All Items", description: "View full menu" },
    ],
  },
  ar: {
    dir: "rtl",
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
    openUntil: "🕒 مفتوح حتى الساعة 11 مساءً",
    createAccount: "إنشاء حساب",
    allDay: "24/7",
    categories: [
      { name: "بيتزا", description: "طازجة يومياً، أكثر من 30 إضافة", price: "12.99$+" },
      { name: "مشروبات", description: "مشروبات منعشة، باردة وساخنة", price: "2.99$+" },
      { name: "حلويات", description: "حلويات لذيذة، منزلية الصنع", price: "5.99$+" },
      { name: "كل الأصناف", description: "عرض القائمة الكاملة" },
    ],
  },
};

// =============== بيانات ثابتة ===============
const navLinksData = [
  { key: "home", href: "/", icon: <Home className="w-4 h-4" /> },
  { key: "menu", href: "/menu", icon: <Utensils className="w-4 h-4" />, hasSubmenu: true },
  { key: "about", href: "/about", icon: <Info className="w-4 h-4" /> },
  { key: "contact", href: "/contact", icon: <Mail className="w-4 h-4" /> },
];

const menuCategoriesData = [
  {
    key: 0,
    href: "/menu/pizza",
    icon: <ChefHat className="w-5 h-5" />,
    color: "red",
    popular: true,
  },
  {
    key: 1,
    href: "/menu/drinks",
    icon: <GlassWater className="w-5 h-5" />,
    color: "blue",
  },
  {
    key: 2,
    href: "/menu/desserts",
    icon: <Cake className="w-5 h-5" />,
    color: "pink",
  },
  {
    key: 3,
    href: "/menu",
    icon: <Utensils className="w-5 h-5" />,
    color: "yellow",
    special: true,
  },
];

// دالة مساعدة للألوان
const getCategoryColor = (color, type = "bg") => {
  const colors = {
    red: {
      bg: "bg-linear-to-br from-red-500/20 to-red-600/10",
      text: "text-red-400",
      border: "border-red-500/30 hover:border-red-500/60",
    },
    blue: {
      bg: "bg-linear-to-br from-blue-500/20 to-blue-600/10",
      text: "text-blue-400",
      border: "border-blue-500/30 hover:border-blue-500/60",
    },
    pink: {
      bg: "bg-linear-to-br from-pink-500/20 to-pink-600/10",
      text: "text-pink-400",
      border: "border-pink-500/30 hover:border-pink-500/60",
    },
    yellow: {
      bg: "bg-linear-to-br from-yellow-500/20 to-yellow-600/10",
      text: "text-yellow-400",
      border: "border-yellow-500/30 hover:border-yellow-500/60",
    },
  };
  return colors[color]?.[type] ?? colors.yellow[type];
};

// =============== زر تغيير اللغة (مُعرّف خارج المكون) ===============
const LangToggle = ({ mobile = false, lang, onToggle }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    className={`flex items-center gap-1.5 font-semibold transition-all rounded-xl
      ${mobile
        ? "px-4 py-3 w-full justify-center bg-neutral-800/60 hover:bg-neutral-800 text-gray-200"
        : "px-3 py-2 hover:bg-white/10 text-gray-300 hover:text-yellow-400 border border-transparent hover:border-yellow-500/30"
      }`}
    aria-label="Toggle language"
  >
    <Globe className="w-4 h-4" />
    <span className={`text-sm ${mobile ? "" : "hidden xl:inline"}`}>
      {lang === "en" ? "عربي" : "EN"}
    </span>
  </motion.button>
);

// =============== المكون الرئيسي ===============
export default function Navbar() {
  const { cart } = useCart();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token_pizza");
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("site_lang") ?? "en";
  });
  const [activeCategory, setActiveCategory] = useState(null);

  const t = translations[lang];
  const isRTL = t.dir === "rtl";

  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // عدد عناصر السلة من Context + localStorage
  const numOfCart = cart?.length ?? 0;

  // تطبيق اتجاه الصفحة عند تغيير اللغة
  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  // تبديل اللغة
  const toggleLang = useCallback(() => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    localStorage.setItem("site_lang", next);
  }, [lang]);

  // متابعة التمرير
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setActiveCategory(null);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('button[aria-label="toggle-mobile-menu"]')
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // إغلاق عند Escape + منع تمرير الصفحة
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
        setActiveCategory(null);
      }
    };
    document.body.style.overflow = open ? "hidden" : "";
    if (open || menuOpen) document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, menuOpen]);

  const isLinkActive = useCallback(
    (href) => (href === "/" ? pathname === href : pathname === href || pathname.startsWith(href + "/")),
    [pathname]
  );

  const navLinks = navLinksData.map((l) => ({ ...l, name: t[l.key] }));
  const menuCategories = menuCategoriesData.map((c, i) => ({
    ...c,
    name: t.categories[c.key].name,
    description: t.categories[c.key].description,
    price: t.categories[c.key].price,
  }));

  return (
    <div className="mb-20">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-60 transition-all duration-500 ${
          scrolled
            ? "bg-neutral-900/97 backdrop-blur-xl shadow-2xl border-b border-neutral-800/60 py-2"
            : "bg-linear-to-b from-neutral-900/90 to-neutral-900/40 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container flex items-center justify-between px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          {/* ===== الشعار ===== */}
          <Link
            href="/"
            className="relative flex items-center gap-3 transition-all duration-300 group hover:scale-105"
            aria-label="Go to homepage"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                className="absolute transition-all duration-300 rounded-full -inset-2 bg-linear-to-r from-yellow-500/30 to-yellow-600/30 blur-md group-hover:from-yellow-500/50 group-hover:to-yellow-600/50"
              />
              <div className="relative flex items-center justify-center overflow-hidden rounded-full shadow-2xl w-11 h-11 bg-linear-to-br from-yellow-400 to-yellow-600">
                <Pizza className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-col hidden sm:flex">
              <span className="text-xl font-bold tracking-tight text-white">
                Pizza<span className="text-yellow-400">House</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-yellow-500/70 uppercase">
                {t.since}
              </span>
            </div>
          </Link>

          {/* ===== روابط التنقل (Desktop) ===== */}
          <div className="items-center hidden gap-4 lg:flex">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href} className="relative">
                  {link.hasSubmenu ? (
                    <div
                      onMouseEnter={() => setMenuOpen(true)}
                      onMouseLeave={() => {
                        setTimeout(() => {
                          if (!menuRef.current?.matches(":hover")) {
                            setMenuOpen(false);
                            setActiveCategory(null);
                          }
                        }, 120);
                      }}
                    >
                      <button
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${
                          isLinkActive(link.href)
                            ? "text-yellow-400 bg-yellow-500/15"
                            : "text-gray-300 hover:text-yellow-400 hover:bg-white/5"
                        }`}
                        aria-expanded={menuOpen}
                        aria-haspopup="true"
                      >
                        {link.icon}
                        <span>{link.name}</span>
                        <motion.div animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <IoIosArrowDown className="w-3.5 h-3.5" />
                        </motion.div>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${
                        isLinkActive(link.href)
                          ? "text-yellow-400 bg-yellow-500/15"
                          : "text-gray-300 hover:text-yellow-400 hover:bg-white/5"
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* ===== القائمة الفرعية (Mega Menu) ===== */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.97 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 220 }}
                  className="absolute left-0 right-0 px-4 mx-auto top-[68px] max-w-7xl"
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => {
                    setMenuOpen(false);
                    setActiveCategory(null);
                  }}
                >
                  <div className="w-full p-5 overflow-hidden border shadow-2xl bg-neutral-900/98 backdrop-blur-xl rounded-2xl border-neutral-800/80">
                    {/* Banner */}
                    <div className="relative p-4 mb-5 overflow-hidden border rounded-xl bg-linear-to-r from-yellow-500/15 to-amber-600/10 border-yellow-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-yellow-500/20">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{t.todaySpecials}</h3>
                            <p className="text-xs text-gray-400">{t.offerCode}</p>
                          </div>
                        </div>
                        <Link
                          href="/offers"
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-yellow-400 transition-all rounded-lg bg-white/10 hover:bg-white/20"
                        >
                          {t.viewOffers}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-4 gap-3">
                      {menuCategories.map((cat) => (
                        <motion.div
                          key={cat.href}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onHoverStart={() => setActiveCategory(cat.name)}
                          onHoverEnd={() => setActiveCategory(null)}
                        >
                          <Link
                            href={cat.href}
                            onClick={() => { setMenuOpen(false); setActiveCategory(null); }}
                            className={`block p-4 rounded-xl transition-all duration-300 border ${getCategoryColor(cat.color, "bg")} ${getCategoryColor(cat.color, "border")}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2.5 rounded-lg ${getCategoryColor(cat.color, "bg")}`}>
                                <span className={getCategoryColor(cat.color, "text")}>{cat.icon}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <h4 className="text-sm font-semibold text-white truncate">{cat.name}</h4>
                                  {cat.popular && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-medium text-yellow-400 bg-yellow-500/20 rounded-full whitespace-nowrap">
                                      {t.popular}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs leading-relaxed text-gray-400">{cat.description}</p>
                                {cat.price && (
                                  <p className="mt-1.5 text-xs font-semibold text-yellow-400">
                                    {t.starting} {cat.price}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800/80">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <Link href="/menu/new" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
                          <Sparkles className="w-3.5 h-3.5" /> {t.newItems}
                        </Link>
                        <Link href="/menu/popular" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
                          <Star className="w-3.5 h-3.5" /> {t.mostPopular}
                        </Link>
                      </div>
                      <Link href="/menu" className="flex items-center gap-2 text-xs font-semibold text-yellow-400 transition-colors hover:text-yellow-300">
                        {t.viewFullMenu}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== أزرار الإجراءات (Desktop) ===== */}
            <div className="flex items-center gap-2 ps-4 ms-2 border-s border-neutral-700">
              {/* زر البحث */}
              <button
                className="p-2.5 transition-all rounded-xl hover:bg-white/10 text-gray-300 hover:text-yellow-400"
                aria-label={t.search}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* زر تغيير اللغة */}
              <LangToggle lang={lang} onToggle={toggleLang} />

              {!authLoading && authToken ? (
                <>
                  {/* السلة */}
                  <Link href="/cart" className="relative p-2.5 transition-all rounded-xl hover:bg-white/10 group" aria-label={t.cart}>
                    <ShoppingCart className="w-4 h-4 text-gray-300 transition-colors group-hover:text-yellow-400" />
                    <AnimatePresence>
                      {numOfCart > 0 && (
                        <motion.span
                          key="badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white rounded-full shadow-lg -top-1 -right-1 bg-linear-to-r from-red-500 to-red-600"
                        >
                          {numOfCart > 9 ? "9+" : numOfCart}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>

                  {/* البروفايل */}
                  <Link href="/profile" className="p-2.5 transition-all rounded-xl hover:bg-white/10 group" aria-label="Profile">
                    <User className="w-4 h-4 text-gray-300 transition-colors group-hover:text-yellow-400" />
                  </Link>

                  {/* المفضلة */}
                  <Link href="/wishlist" className="p-2.5 transition-all rounded-xl hover:bg-white/10 group" aria-label={t.wishlist}>
                    <Heart className="w-4 h-4 text-gray-300 transition-colors group-hover:text-yellow-400" />
                  </Link>

                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      href="/order"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 shadow-lg bg-linear-to-r from-yellow-500 to-yellow-600 rounded-xl hover:from-yellow-600 hover:to-yellow-700 hover:shadow-yellow-500/30"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span className="hidden xl:inline">{t.orderNow}</span>
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-300 transition-all rounded-xl hover:bg-white/10 hover:text-yellow-400"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden xl:inline">{t.signIn}</span>
                  </Link>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      href="/register"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 shadow-lg bg-linear-to-r from-yellow-500 to-yellow-600 rounded-xl hover:from-yellow-600 hover:to-yellow-700"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="hidden xl:inline">{t.register}</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* ===== زر القائمة (Mobile) ===== */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative z-50 flex items-center justify-center w-10 h-10 text-white transition-all rounded-xl lg:hidden hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-label="toggle-mobile-menu"
            aria-expanded={open}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* ===== القائمة المتنقلة (Mobile) ===== */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-90 lg:hidden bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, x: isRTL ? "-100%" : "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 z-40 shadow-2xl w-80 lg:hidden bg-neutral-900 border-s border-neutral-800/60"
              style={{ [isRTL ? "right" : "right"]: 0 }}
            >
              <div className="h-full pt-20 pb-6 overflow-y-auto">
                <div className="px-4 space-y-5">

                  {/* Quick Actions */}
                  <div className="grid grid-cols-4 gap-1.5 p-2 rounded-2xl bg-neutral-800/50">
                    {[
                      { href: "/search", icon: <Search className="w-4 h-4 text-gray-300" />, label: t.search },
                      { href: "/offers", icon: <Sparkles className="w-4 h-4 text-yellow-400" />, label: t.offers },
                      {
                        href: "/cart",
                        icon: (
                          <div className="relative">
                            <ShoppingCart className="w-4 h-4 text-gray-300" />
                            {numOfCart > 0 && (
                              <span className="absolute flex items-center justify-center w-3.5 h-3.5 text-[9px] font-bold text-white bg-red-500 rounded-full -top-2 -right-2">
                                {numOfCart > 9 ? "9+" : numOfCart}
                              </span>
                            )}
                          </div>
                        ),
                        label: t.cart,
                      },
                      { href: "/wishlist", icon: <Heart className="w-4 h-4 text-gray-300" />, label: t.wishlist },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        {item.icon}
                        <span className="text-[10px] text-gray-400">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-0.5">
                    {navLinks.map((link) => (
                      <div key={link.href}>
                        {link.hasSubmenu ? (
                          <>
                            <button
                              onClick={() => setMenuOpen((v) => !v)}
                              className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all text-sm ${
                                isLinkActive(link.href)
                                  ? "bg-yellow-500/15 text-yellow-400"
                                  : "hover:bg-white/5 text-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {link.icon}
                                <span className="font-semibold">{link.name}</span>
                              </div>
                              <motion.div animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <IoIosArrowDown className="w-4 h-4" />
                              </motion.div>
                            </button>

                            <AnimatePresence>
                              {menuOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden ps-4 mt-0.5"
                                >
                                  <div className="ms-3 ps-3 space-y-0.5 border-s border-neutral-700">
                                    {menuCategories.map((cat) => (
                                      <Link
                                        key={cat.href}
                                        href={cat.href}
                                        onClick={() => { setOpen(false); setMenuOpen(false); }}
                                        className="flex items-center gap-3 px-3 py-3 transition-all rounded-xl hover:bg-white/5"
                                      >
                                        <div className={`p-2 rounded-lg ${getCategoryColor(cat.color, "bg")}`}>
                                          <span className={getCategoryColor(cat.color, "text")}>{cat.icon}</span>
                                        </div>
                                        <div>
                                          <p className="text-sm font-semibold text-white">{cat.name}</p>
                                          <p className="text-xs text-gray-400">{cat.description}</p>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all text-sm ${
                              isLinkActive(link.href)
                                ? "bg-yellow-500/15 text-yellow-400"
                                : "hover:bg-white/5 text-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {link.icon}
                              <span className="font-semibold">{link.name}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Language Toggle (Mobile) */}
                  <LangToggle mobile lang={lang} onToggle={toggleLang} />

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-neutral-800">
                    {!authLoading && !authToken ? (
                      <div className="space-y-2">
                        <Link
                          href="/login"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-center w-full gap-2 px-6 py-3.5 text-sm font-semibold text-white transition-all rounded-xl bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                        >
                          <LogIn className="w-4 h-4" />
                          {t.signIn}
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-center w-full gap-2 px-6 py-3.5 text-sm font-semibold text-gray-300 transition-all border rounded-xl border-neutral-700 hover:bg-white/5"
                        >
                          {t.createAccount}
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href="/order"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center w-full gap-2 px-6 py-3.5 text-sm font-semibold text-white transition-all rounded-xl bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {t.orderNow}
                      </Link>
                    )}

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Link
                        href="tel:+1234567890"
                        className="flex flex-col items-center p-3.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
                      >
                        <Phone className="w-4 h-4 mb-1.5 text-yellow-400" />
                        <span className="text-xs font-semibold text-white">{t.callUs}</span>
                        <span className="text-[10px] text-gray-400">{t.allDay}</span>
                      </Link>
                      <Link
                        href="/locations"
                        className="flex flex-col items-center p-3.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
                      >
                        <MapPin className="w-4 h-4 mb-1.5 text-yellow-400" />
                        <span className="text-xs font-semibold text-white">{t.findUs}</span>
                        <span className="text-[10px] text-gray-400">{t.locations}</span>
                      </Link>
                    </div>

                    <div className="p-3 mt-3 text-center border rounded-xl bg-linear-to-r from-yellow-500/10 to-amber-600/10 border-yellow-500/15">
                      <p className="text-xs text-yellow-400">{t.openUntil}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}