"use client";
import { createContext, useContext } from "react";
export const MenuContext = createContext([]);
import Fries from "@/public/fries.png";
export default function MenuProvider({ children }) {
  const menu = [
    {
      category: "Pizza",
      items: [
        {
          id: "1p",
          name: "Double Creamy Cheese",
          image:
            "https://roma2go.com/wp-content/uploads/2024/12/Double-Creamy-Cheese.webp",
          price: null,
          priceBySize: { s: 50, m: 75, l: 100, xl: 125 },
          sizes: ["s", "m", "l", "xl"],
          isDiscount: false,
          oldPrice: null,
          discountPercentage: null,
          ingredients: ["cheese", "tomato", "cream", "herbs"],
          description: "Creamy cheese pizza with rich flavors.",
        },
        {
          id: "2p",
          name: "Smokey Cheese Pizza",
          image:
            "https://roma2go.com/wp-content/uploads/2024/09/Smokey-Cheese.webp",
          price: null,
          priceBySize: { s: 100, m: 125, l: 150, xl: 175 },
          sizes: ["s", "m", "l", "xl"],
          isDiscount: true,
          oldPrice: 150,
          discountPercentage: 20,
          ingredients: ["cheese", "smoke sauce"],
          description: "Smoky flavored cheese pizza.",
        },
        {
          id: "3p",
          name: "Fresh Mushroom",
          image:
            "https://roma2go.com/wp-content/uploads/2024/02/Fresh-Mushroom-1.webp",
          price: null,
          priceBySize: { s: 75, m: 100, l: 125, xl: 150 },
          sizes: ["s", "m", "l", "xl"],
          isDiscount: false,
          oldPrice: null,
          discountPercentage: null,
          ingredients: ["mushroom", "cheese"],
          description: "Pizza topped with fresh mushrooms and melted cheese.",
        },
        {
          id: "4p",
          name: "Mixed Cheese",
          image:
            "https://roma2go.com/wp-content/uploads/2023/01/mixedcheese.webp",
          price: null,
          priceBySize: { s: 120, m: 145, l: 170, xl: 200 },
          sizes: ["s", "m", "l", "xl"],
          isDiscount: false,
          oldPrice: null,
          discountPercentage: null,
          ingredients: ["mozzarella", "cheddar", "parmesan"],
          description: "A rich blend of multiple cheeses for cheese lovers.",
        },
      ],
    },
    {
      category: "Pizza Bar",
      items: [
        {
          id: "1pb",
          name: "Pizza Fries",
          image:
            "https://roma2go.com/wp-content/uploads/2025/08/Chicken-Ranch-Pizza-Bar.webp",
          price: 60,
          priceBySize: null,
          sizes: [],
          isDiscount: false,
          oldPrice: null,
          discountPercentage: null,
          ingredients: ["fries", "cheese"],
          description: "Crispy fries with pizza topping.",
        },
        {
          id: "2pb",
          name: "Chicken Rolls",
          image:
            "https://roma2go.com/wp-content/uploads/2025/08/BBQ-Pizza-Bar-1.webp",
          price: 75,
          priceBySize: null,
          sizes: [],
          isDiscount: false,
          oldPrice: null,
          discountPercentage: null,
          ingredients: ["chicken", "bread"],
          description: "Stuffed chicken rolls.",
        },
       
      ],
    },
    {
      category: "Dessert",
      items: [
        {
          id: "1d",
          name: "Chocolate Cake",
          image:
            "https://roma2go.com/wp-content/uploads/2024/04/Apple-Pie.webp",
          price: 45,
          priceBySize: null,
          sizes: [],
          isDiscount: false,
          oldPrice: null,
          discountPercentage: null,
          ingredients: ["chocolate", "cake"],
          description: "Rich chocolate dessert.",
        },
      ],
    },
    {
      category: "Other",
      items: [
        {
          id: "1o",
          name: "French Fries",
          image: Fries,
          price: 30,
          priceBySize: null,
          sizes: [],
          isDiscount: false,
          oldPrice: null,
          discountPercentage: null,
          ingredients: ["potato"],
          description: "Crispy fries.",
        },
        {
          id: "2o", // ✅ اتصلحت
          name: "Cheesy Breadsticks",
          image:
            "https://roma2go.com/wp-content/uploads/2024/11/Cheesy-Breadsticks.webp",
          price: 40,
          priceBySize: null,
          sizes: [],
          isDiscount: false,
          oldPrice: null,
          discountPercentage: null,
          ingredients: ["potato", "cheese"],
          description: "Fries with melted cheese.",
        },
      ],
    },
  ];
  return <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>;
}
export function useMenu() {
  return useContext(MenuContext);
}
