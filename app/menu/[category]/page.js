"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";

export default function MenuCategory() {
  const params = useParams();
  const category = params.category; 
  
  const menuItems = {
    pizza: [
      { name: "Margherita", price: "$10" },
      { name: "Pepperoni", price: "$12" },
    ],
    drinks: [
      { name: "Cola", price: "$2" },
      { name: "Orange Juice", price: "$3" },
    ],
    desserts: [
      { name: "Cheesecake", price: "$5" },
      { name: "Brownie", price: "$4" },
    ],
  };

  const items = menuItems[category] || [];

  return (
    <>
    <Navbar />
    <div className="min-h-screen px-6 py-12 text-white bg-neutral-900">
      <h1 className="text-4xl font-bold text-center text-yellow-400 capitalize">
        {category}
      </h1>

      <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="p-6 transition shadow-lg bg-neutral-800 rounded-xl hover:shadow-yellow-500/30"
            >
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="mt-2 text-yellow-400">{item.price}</p>
              <button className="w-full py-2 mt-4 text-black transition bg-yellow-500 rounded-xl hover:bg-yellow-400">
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-neutral-400">
            No items found for this category.
          </p>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link href="/menu" className="text-yellow-400 hover:underline">
          Back to Menu
        </Link>
      </div>
    </div>
    <Footer/>
    </>
  );
}
