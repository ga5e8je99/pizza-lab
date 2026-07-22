import Link from "next/link";
import Wave from "./Wave";
import { Pizza } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative px-6 py-12 text-black bg-yellow-500 md:px-20">
      <div className="absolute left-0 w-full rotate-180 z-55 -top-2 ">
        <Wave/>
      </div>
      <div className="absolute inset-0 bg-[url('/pizza.png')] bg-cover bg-center opacity-20 z-50 " />
      <div className="container relative grid items-center justify-center grid-cols-1 gap-10 mx-auto text-center mt-30 md:grid-cols-4 md:text-left z-60">
        {/* Logo */}
        <div>
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <Pizza/>
            <h1 className="text-4xl font-extrabold md:text-3xl logo">Pizza House</h1>
          </div>
          <p className="mt-4 text-base font-medium md:text-lg text-black/80">
            The best pizza in your city — fresh, hot, and delivered fast.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="mb-4 text-xl font-bold md:text-2xl">Menu</h3>
          <ul className="space-y-2 text-base md:text-lg">
            {["Pizza", "Drinks", "Offers", "Desserts"].map((item) => (
              <li key={item}>
                <Link
                  href="/"
                  className="transition-colors duration-200 hover:underline hover:text-black/70"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-xl font-bold md:text-2xl">Quick Links</h3>
          <ul className="space-y-2 text-base md:text-lg">
            {["About Us", "Contact", "Order Now", "FAQ"].map((item) => (
              <li key={item}>
                <Link
                  href="/"
                  className="transition-colors duration-200 hover:text-black/70 hover:underline"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-xl font-bold md:text-2xl">Contact</h3>
          <ul className="space-y-4 text-base text-center md:text-lg">
            <li className="flex items-center justify-center gap-3 md:justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              123 Pizza Street
            </li>
            <li className="flex items-center justify-center gap-3 md:justify-start ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              0100 123 4567
            </li>
            <li className="flex items-center justify-center gap-3 md:justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                />
              </svg>
              pizzahouse@email.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative pt-6 mt-10 text-sm font-semibold text-center border-t border-black/40 md:text-lg text-black/80 z-60">
        © {new Date().getFullYear()} Pizza House — All Rights Reserved.
      </div>
    </footer>
  );
}
