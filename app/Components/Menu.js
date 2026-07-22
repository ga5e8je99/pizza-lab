"use client";
import Image from "next/image";
import pizzaRight from "@/public/svgexport-15 (3).svg";
import pizzaLeft from "@/public/svgexport-15 (2).svg";
import Offer1 from "@/public/offer1.png";
import fries from "@/public/fries.png";
import pizzaBar from "@/public/Chicken-Ranch-Pizza-Bar.png";
import desserts from "@/public/lotuscake.png";
import Title from "./SectionTitle";
import ProductCard from "./ProductCart"; // Fixed import name
import { useMenu } from "../Context/MenuContext";
import { useState } from "react";

export default function Menu() {
  const menu = useMenu();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handle loading state
  if (!menu) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Handle empty menu
  if (menu.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl text-white">No menu items available</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-black bg-yellow-500 rounded-lg hover:bg-yellow-600"
        >
          Refresh
        </button>
      </div>
    );
  }

  // Category data with proper routing
  const categories = [
    { name: "Pizza", image: Offer1, slug: "pizza" },
    { name: "Pizza bar", image: pizzaBar, slug: "pizza-bar" },
    { name: "Desserts", image: desserts, slug: "desserts" },
    { name: "Other", image: fries, slug: "other" },
  ];

  const handleCategoryClick = (categorySlug) => {
    setSelectedCategory(categorySlug);
    // Scroll to category section
    const element = document.getElementById(`category-${categorySlug}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center w-full min-h-screen gap-10 px-6 py-10 menu lg:px-20">
        <Title imageLeft={pizzaLeft} imageRight={pizzaRight} title={"Menu"} />

        {/* Categories Section */}
        <div className="grid justify-center w-full grid-cols-2 gap-6 category md:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, index) => (
            <div
              key={c.slug}
              onClick={() => handleCategoryClick(c.slug)}
              className="flex gap-3.5 items-center justify-center bg-yellow-500 opacity-90
                 rounded-4xl shadow-md hover:shadow-2xl hover:-translate-y-1 
                 duration-300 cursor-pointer p-2 text-center group transition-all
                 hover:bg-yellow-400"
            >
              <div className="flex items-center justify-center transition-transform size-20 group-hover:scale-110">
                <Image
                  src={c.image}
                  alt={c.name}
                  className="object-contain w-full h-full drop-shadow-md"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {c.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Menu Items by Category */}
        {menu.map((categoryData) => (
          <div
            key={categoryData.category}
            id={`category-${categoryData.category.toLowerCase().replace(/\s+/g, "-")}`}
            className="w-full scroll-mt-24"
          >
            <Title
              imageLeft={pizzaLeft}
              imageRight={pizzaRight}
              title={categoryData.category}
            />

            {/* Grid for products */}
            <div className="grid items-center justify-center w-full grid-cols-1 gap-6 px-4 mt-6 sm:px-6 md:grid-cols-2 lg:grid-cols-3 xl:px-20">
              {categoryData.items && categoryData.items.length > 0 ? (
                categoryData.items.map((item, index) => (
                  <ProductCard
                    key={`${categoryData.category}-${item.id || index}`}
                    {...item}
                    category={categoryData.category}
                  />
                ))
              ) : (
                <div className="py-8 text-center col-span-full text-neutral-400">
                  No items available in this category
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
