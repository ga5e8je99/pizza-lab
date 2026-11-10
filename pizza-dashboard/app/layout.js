import "./globals.css";

export const metadata = {
  title: "Pizza Lab | Admin Dashboard لوحة التحكم",
  description: "Standalone Pizza Restaurant Management Dashboard & Live Orders",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased bg-stone-950 text-stone-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}

