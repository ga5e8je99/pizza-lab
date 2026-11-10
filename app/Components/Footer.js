"use client";

import Link from "next/link";
import Wave from "./Wave";
import { Pizza, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "../Context/LanguageContext";

export default function Footer() {
  const { isRTL, lang } = useLanguage();

  const isArabic = lang === "ar";

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className="relative px-6 py-14 text-neutral-950 bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 md:px-20 mt-16"
    >
      {/* Wave Transition from Dark Background */}
      <div className="absolute left-0 right-0 w-full rotate-180 -top-8 z-20 pointer-events-none">
        <Wave color="#121212" />
      </div>

      <div className="container relative z-30 grid grid-cols-1 gap-10 mx-auto text-center md:grid-cols-4 md:text-start pt-6">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="p-2 rounded-xl bg-neutral-950 text-amber-400 shadow-md">
              <Pizza className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-neutral-950">
              {isArabic ? "بيتزا هاوس" : "Pizza House"}
            </h2>
          </div>
          <p className="text-sm sm:text-base font-semibold text-neutral-950/85 leading-relaxed">
            {isArabic
              ? "أفضل بيتزا إيطالية في مدينتك — طازجة يومياً، ساخنة ومقرمشة، وتصلك بأعلى جودة وأسرع وقت."
              : "The finest Italian pizza in your city — fresh daily, piping hot and crispy, delivered fast."}
          </p>
        </div>

        {/* Menu Links */}
        <div>
          <h3 className="mb-4 text-lg font-black text-neutral-950 uppercase tracking-wide">
            {isArabic ? "القائمة" : "Menu"}
          </h3>
          <ul className="space-y-2.5 text-sm sm:text-base font-bold text-neutral-900/90">
            {[
              { href: "/menu/pizza", labelAr: "البيتزا", labelEn: "Pizza" },
              { href: "/menu/drinks", labelAr: "المشروبات", labelEn: "Drinks" },
              { href: "/menu/desserts", labelAr: "الحلويات", labelEn: "Desserts" },
              { href: "/offers", labelAr: "العروض الخاصة", labelEn: "Offers" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-red-800 hover:underline"
                >
                  {isArabic ? item.labelAr : item.labelEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-black text-neutral-950 uppercase tracking-wide">
            {isArabic ? "روابط سريعة" : "Quick Links"}
          </h3>
          <ul className="space-y-2.5 text-sm sm:text-base font-bold text-neutral-900/90">
            {[
              { nameAr: "من نحن", nameEn: "About Us", href: "/about" },
              { nameAr: "تواصل معنا", nameEn: "Contact", href: "/contact" },
              { nameAr: "اطلب الآن", nameEn: "Order Now", href: "/menu" },
              { nameAr: "لوحة التحكم", nameEn: "Admin Dashboard", href: "http://localhost:3001" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  className="transition-colors hover:text-red-800 hover:underline"
                >
                  {isArabic ? item.nameAr : item.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="mb-4 text-lg font-black text-neutral-950 uppercase tracking-wide">
            {isArabic ? "تواصل معنا" : "Contact"}
          </h3>
          <ul className="space-y-3 text-sm sm:text-base font-bold text-neutral-900/90">
            <li className="flex items-center justify-center gap-3 md:justify-start">
              <MapPin className="w-5 h-5 shrink-0 text-red-700" />
              <span>{isArabic ? "123 شارع البيتزا، القاهرة" : "123 Pizza Street"}</span>
            </li>
            <li className="flex items-center justify-center gap-3 md:justify-start">
              <Phone className="w-5 h-5 shrink-0 text-red-700" />
              <span dir="ltr">0100 123 4567</span>
            </li>
            <li className="flex items-center justify-center gap-3 md:justify-start">
              <Mail className="w-5 h-5 shrink-0 text-red-700" />
              <span>support@pizzahouse.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="relative pt-6 mt-10 text-xs sm:text-sm font-bold text-center border-t border-neutral-950/20 text-neutral-950/80 z-30">
        © {new Date().getFullYear()} {isArabic ? "بيتزا هاوس — جميع الحقوق محفوظة" : "Pizza House — All Rights Reserved."}
      </div>
    </footer>
  );
}
