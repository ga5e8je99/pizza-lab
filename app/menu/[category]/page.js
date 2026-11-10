"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import ProductCard from "@/app/Components/ProductCart";
import { useMenu } from "@/app/Context/MenuContext";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChefHat,
  GlassWater,
  Cake,
  Flame,
  Utensils,
  ChevronRight,
} from "lucide-react";

const CATEGORY_TABS = [
  { slug: "all", name: "All Items", nameAr: "الكل", icon: Utensils, href: "/menu" },
  { slug: "pizza", name: "Pizza", nameAr: "بيتزا", icon: ChefHat, href: "/menu/pizza" },
  { slug: "pizza-bar", name: "Pizza Bar", nameAr: "بيتزا بار", icon: Flame, href: "/menu/pizza-bar" },
  { slug: "dessert", name: "Dessert", nameAr: "حلويات", icon: Cake, href: "/menu/dessert" },
  { slug: "drinks", name: "Drinks", nameAr: "مشروبات", icon: GlassWater, href: "/menu/drinks" },
  { slug: "other", name: "Sides", nameAr: "مقبلات", icon: Utensils, href: "/menu/other" },
];

export default function MenuCategory() {
  const params = useParams();
  const rawCategory = (params?.category || "").toString().toLowerCase();

  const menu = useMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default"); // default | price-asc | price-desc | popular

  // Normalize category names (e.g. 'desserts' vs 'dessert', 'pizza-bar' vs 'pizza bar')
  const normalize = (str) =>
    str ? str.toLowerCase().replace(/[-_s]/g, "").trim() : "";

  const currentCategorySlug = normalize(rawCategory);

  // Extract all items for this category
  const allCategoryItems = useMemo(() => {
    if (!menu || !Array.isArray(menu)) return [];

    // Flatten all items with category tagged
    const flatItems = menu.flatMap((cat) =>
      (cat.items || []).map((item) => ({
        ...item,
        category: cat.category,
      }))
    );

    if (currentCategorySlug === "all" || currentCategorySlug === "") {
      return flatItems;
    }

    return flatItems.filter((item) => {
      const itemCat = normalize(item.category);
      return (
        itemCat === currentCategorySlug ||
        itemCat.includes(currentCategorySlug) ||
        currentCategorySlug.includes(itemCat)
      );
    });
  }, [menu, currentCategorySlug]);

  // Filter & sort
  const filteredItems = useMemo(() => {
    let result = [...allCategoryItems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.nameAr && item.nameAr.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const pA = a.price || a.priceBySize?.s || 0;
        const pB = b.price || b.priceBySize?.s || 0;
        return pA - pB;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const pA = a.price || a.priceBySize?.s || 0;
        const pB = b.price || b.priceBySize?.s || 0;
        return pB - pA;
      });
    } else if (sortBy === "popular") {
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return result;
  }, [allCategoryItems, searchQuery, sortBy]);

  // Title display
  const currentTab = CATEGORY_TABS.find(
    (t) => normalize(t.slug) === currentCategorySlug
  );
  const displayTitle = currentTab?.name || rawCategory.replace(/-/g, " ");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
            <Link href="/" className="hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/menu" className="hover:text-yellow-400 transition-colors">
              Menu
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-yellow-400 font-semibold capitalize">
              {displayTitle}
            </span>
          </nav>

          {/* Header Banner */}
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-2xl mb-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-2">
                  Handcrafted Selection
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white capitalize">
                  {displayTitle}
                </h1>
                <p className="mt-2 text-neutral-400 text-sm max-w-xl">
                  Explore our freshly prepared {displayTitle.toLowerCase()} crafted with premium
                  ingredients and authentic recipes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 text-sm font-semibold text-white transition-all border border-neutral-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Full Menu</span>
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 text-sm font-black shadow-lg shadow-amber-900/30 transition-all"
                >
                  <span>View Cart</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Category Navigation Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-8">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                normalize(tab.slug) === currentCategorySlug ||
                (tab.slug === "all" && currentCategorySlug === "");

              return (
                <Link
                  key={tab.slug}
                  href={tab.href}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black shrink-0 transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-neutral-950 shadow-lg shadow-amber-900/30 scale-105"
                      : "bg-neutral-900/90 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Controls: Search and Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${displayTitle}...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-neutral-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 focus:outline-none focus:border-yellow-500"
              >
                <option value="default">Default Order</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <ProductCard
                  key={item.id || idx}
                  {...item}
                  category={item.category || displayTitle}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800/80">
              <ChefHat className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-200">
                No items found in this section
              </h3>
              <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
                We are constantly updating our menu. Try searching for something else or browse another category.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                >
                  Clear Search
                </button>
                <Link
                  href="/menu"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-xs font-black text-neutral-950 shadow-md shadow-amber-900/20 transition-all"
                >
                  View All Menu
                </Link>
              </div>
            </div>
          )}

          {/* Back to Menu Footer Link */}
          <div className="mt-16 text-center pt-8 border-t border-neutral-800/80">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-amber-400 text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Categories</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
