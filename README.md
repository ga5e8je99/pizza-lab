<div align="center">

<!-- Animated Header Wave Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=7F1D1D,DC2626,EA580C,F59E0B&height=200&section=header&text=PizzaHouse%20%E2%80%A2%20Delivery%20Platform&fontSize=38&fontAlignY=38&fontColor=ffffff&desc=Modern%20Online%20Food%20Ordering%2C%20Artisan%20Pizza%20Customization%20%26%20Delivery%20System&descAlignY=58&descAlign=50&descSize=15&animation=twinkling" width="100%" alt="PizzaHouse Banner" />

<!-- Animated Typing SVG -->
<p align="center">
  <a href="https://pizza-lab-dv1o.vercel.app/">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=19&duration=2500&pause=1000&color=EA580C&center=true&vCenter=true&multiline=false&width=620&height=42&lines=%F0%9F%8D%95+Artisan+Stone-Baked+Pizza+Customizer;%E2%9A%A1+Zustand+Persistent+Cart+Store;%F0%9F%8C%90+Bilingual+Arabic+(RTL)+%26+English+UI;%F0%9F%9A%80+Framer+Motion+Micro-Interactions" alt="PizzaHouse Capabilities" />
  </a>
</p>

<!-- Tech Stack Badges -->
[![Live Application](https://img.shields.io/badge/Live%20Demo-pizza--lab.vercel.app-DC2626?style=for-the-badge&logo=vercel&logoColor=white)](https://pizza-lab-dv1o.vercel.app/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://github.com/pmndrs/zustand)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

<!-- Animated Skill Icons -->
<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,nodejs,git,vercel&theme=dark" alt="Core Technologies" />
</p>

**[Explore Live Demo](https://pizza-lab-dv1o.vercel.app/)** • **[System Architecture](#-system-architecture)** • **[Features](#-key-features)** • **[Local Setup](#-getting-started)**

</div>

---

## 🏛️ System Architecture

```mermaid
flowchart TD
  subgraph UserInterface ["Client & UI Experience"]
    direction TB
    MENU["Interactive Menu & Category Tabs"]
    CUSTOMIZER["Pizza Customizer (Crust, Sauce, Toppings & Size)"]
    SWIPER["Swiper.js Hero Banners & Deals Carousel"]
  end

  subgraph StateManagement ["State & Business Logic"]
    direction TB
    STORE["Zustand Persistent Cart Store (LocalStorage Sync)"]
    PRICING["Dynamic Pricing Engine (Size multipliers + Topping add-ons)"]
    PROMO["Promo Code & Delivery Fee Calculator"]
  end

  subgraph CheckoutFlow ["Ordering & Dispatch Engine"]
    direction TB
    CHECKOUT["Fast 60-Second Checkout Form"]
    NOTIFY["React-Toastify Order Feedback Alerts"]
    STATUS["Order Summary & Confirmation Receipt"]
  end

  UserInterface --> StateManagement
  StateManagement --> CheckoutFlow
```

---

## ✨ Key Features

### 🍕 Artisan Menu & Category Filtering
- Browse stone-baked pizzas, gourmet sides, beverages, and desserts.
- Instant category switching with smooth animated tab transitions.
- High-resolution food photography with responsive image optimization.

### 🛠️ Interactive Pizza Customizer
- Real-time selection of crust types (Classic Thin, Stuffed Crust, Pan, Gluten-Free).
- Multi-tier sauce selection (San Marzano Tomato, Creamy Garlic, Spicy Arrabiata, BBQ).
- Dynamic extra toppings (Mozzarella, Pepperoni, Mushrooms, Truffle Oil, Fresh Basil) with instant price calculation.

### 🛒 High-Performance Persistent Cart
- Powered by **Zustand** with persistent browser storage: cart items survive page reloads and browser restarts.
- Instant item count and subtotal adjustments without page re-renders.
- Dynamic delivery fee calculations, taxes, and promotional coupon code validation.

### 🌐 Bilingual RTL / LTR Experience
- Native support for Arabic (RTL) and English (LTR).
- Fluid typography, custom fonts, and culturalized number formatting.

### 📱 Mobile-First Responsive Design
- Crafted from the ground up with **Tailwind CSS v4** and **Framer Motion**.
- Touch-friendly sticky navigation, bottom cart sheets, and sub-second page transitions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or 20+)
- npm, pnpm, or yarn

### Installation
```bash
git clone https://github.com/ga5e8je99/pizza-lab.git
cd pizza-lab
npm install
```

### Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 📄 License
This project is licensed under the MIT License.
