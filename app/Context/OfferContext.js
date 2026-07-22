"use client";
import { createContext } from "react";
export const OfferContext = createContext([]);
export default function OfferProvider({ children }) {
  const offer = [
    {
      id: 1,
      img: "/offer1.png",
      gift: "/cola.png",
      giftLabel: "+ Free Cola",
      title: "Pepperoni Pizza",
      desc: "Spicy pepperoni with mozzarella & tomato sauce.",
      price: 199,
      oldPrice: 249,
      discount: "20% OFF",
    },
    {
      id: 2,
      img: "/offer2.png",
      gift: "/fries.png",
      giftLabel: "+ Free Fries",
      title: "Veggie Mix",
      desc: "Fresh mushrooms, olives, peppers & cheese.",
      price: 169,
      oldPrice: 199,
      discount: "15% OFF",
    },
    {
      id: 3,
      img: "/offer3.png",
      gift: "/offer3.png",
      giftLabel: "+ Extra Small Pizza",
      title: "Cheese Lovers",
      desc: "Parmesan, cheddar & mozzarella blend.",
      price: 149,
      oldPrice: 199,
      discount: "25% OFF",
    },
    {
      id: 4,
      img: "/offer4.png",
      gift: null,
      giftLabel: null,
      title: "BBQ Chicken",
      desc: "Smoky BBQ sauce with tender chicken.",
      price: 179,
      oldPrice: 259,
      discount: "30% OFF",
    },
  ];
  return (
   
      <OfferContext.Provider value={offer}>{children}</OfferContext.Provider>
    
  );
}
export function useOffer() {
  const offers = OfferProvider();
  return offers;
}
