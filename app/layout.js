import "./globals.css";
import ToastProvider from "./Components/ToastProvider";
import MenuProvider from "./Context/MenuContext";
import { CartProvider } from "./Context/CartContext";
import { LanguageProvider } from "./Context/LanguageContext";

export const metadata = {
  title: "Pizza House - بيتزا هاوس",
  description: "أشهى أنواع البيتزا المخبوزة على الحجر بأجود المكونات الطازجة",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#121212] text-white">
        <LanguageProvider>
          <MenuProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </MenuProvider>
        </LanguageProvider>
        <ToastProvider position="bottom-right" />
      </body>
    </html>
  );
}
