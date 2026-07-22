// components/ProductCard.jsx
"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCartPlus, FaCheese } from "react-icons/fa";
import { GiSaucepan, GiChiliPepper, GiMushroomGills } from "react-icons/gi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Truck,
  Zap,
  Star,
  Flame,
  Tag,
  CheckCircle2,
} from "lucide-react";

// ─── Extras config (outside component to avoid re-creation) ──────────────────
const EXTRAS = [
  { id: "ranch",    label: "Ranch",     icon: <GiSaucepan />,      price: 5  },
  { id: "spice",    label: "Spice",     icon: <GiChiliPepper />,   price: 3  },
  { id: "cheese",   label: "Cheese",    icon: <FaCheese />,        price: 8  },
  { id: "mushroom", label: "Mushrooms", icon: <GiMushroomGills />, price: 6  },
];

const SIZE_LABELS = { S: "Small", M: "Medium", L: "Large", XL: "X-Large" };

const NO_SIZE_CATEGORIES  = ["Other", "Dessert", "Drink", "Appetizer"];
const HAS_EXTRAS_CATEGORIES = ["Pizza", "Burger", "Pasta"];

export default function ProductCard({
  name,
  image,
  price,
  isDiscount = false,
  oldPrice,
  discountPercentage,
  category,
  onClick,
  priceBySize = {},
  id,
  rating = 4.5,
  ratingCount = 128,
  sizes = [],
  ingredients = [],
  description,
}) {
  const [selectedSize,   setSelectedSize]   = useState(sizes[0] || "S");
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [isAdding,       setIsAdding]       = useState(false);
  const [showDetails,    setShowDetails]    = useState(false);
  const [justAdded,      setJustAdded]      = useState(false);

  // ─── Price calculation ───────────────────────────────────────────────────
  const calcPrice = useCallback(() => {
    const base      = parseFloat(price) || 0;
    const sizeExtra = sizes.length > 0 ? parseFloat(priceBySize[selectedSize] ?? 0) : 0;
    const extrasSum = selectedExtras.reduce((acc, eid) => {
      const e = EXTRAS.find((x) => x.id === eid);
      return acc + (e?.price ?? 0);
    }, 0);
    const sub = base + sizeExtra + extrasSum;
    return isDiscount && discountPercentage
      ? (sub * (1 - discountPercentage / 100)).toFixed(2)
      : sub.toFixed(2);
  }, [price, selectedSize, selectedExtras, priceBySize, sizes, isDiscount, discountPercentage]);

  const totalPrice = calcPrice();
  const sizeExtra  = sizes.length > 0 ? parseFloat(priceBySize[selectedSize] ?? 0) : 0;
  const hasExtras  = selectedExtras.length > 0;
  const showSize   = !NO_SIZE_CATEGORIES.includes(category) && sizes.length > 0;
  const showExtras = HAS_EXTRAS_CATEGORIES.includes(category);

  // ─── Toggle extra ────────────────────────────────────────────────────────
  const toggleExtra = useCallback((eid) => {
    setSelectedExtras((prev) =>
      prev.includes(eid) ? prev.filter((x) => x !== eid) : [...prev, eid]
    );
  }, []);

  // ─── Add to cart ─────────────────────────────────────────────────────────
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);

    setTimeout(() => {
      const base      = parseFloat(price) || 0;
      const sizeEx    = sizes.length > 0 ? parseFloat(priceBySize[selectedSize] ?? 0) : 0;
      const extrasSum = selectedExtras.reduce((acc, eid) => {
        const ex = EXTRAS.find((x) => x.id === eid);
        return acc + (ex?.price ?? 0);
      }, 0);
      const sub       = base + sizeEx + extrasSum;
      const finalPrice = isDiscount && discountPercentage
        ? sub * (1 - discountPercentage / 100)
        : sub;

      const addonsKey   = [...selectedExtras].sort().join(",");
      const cartItemId  = `${id}-${selectedSize || "no-size"}-${addonsKey}`;

      const order = {
        id:                    cartItemId,
        name,
        image,
        size:                  selectedSize || null,
        basePrice:             base + sizeEx,
        addons:                selectedExtras.map((eid) => {
          const addon = EXTRAS.find((a) => a.id === eid);
          return { id: addon.id, name: addon.label, price: addon.price };
        }),
        quantity:              1,
        priceWithAddonOnesItem: finalPrice,
        totalPrice:            finalPrice,
        oldPrice:              isDiscount && discountPercentage ? sub : null,
        discountPercentage:    isDiscount ? discountPercentage : null,
      };

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const idx  = cart.findIndex(
        (item) =>
          item.id === order.id &&
          item.size === order.size &&
          JSON.stringify([...item.addons].sort((a, b) => a.id.localeCompare(b.id))) ===
          JSON.stringify([...order.addons].sort((a, b) => a.id.localeCompare(b.id)))
      );

      if (idx !== -1) {
        cart[idx].quantity   += 1;
        cart[idx].totalPrice += finalPrice;
        if (cart[idx].oldPrice) cart[idx].oldPrice += sub;
      } else {
        cart.push(order);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);

      toast.success(`✨ ${name} added to cart!`, {
        position:        "bottom-right",
        autoClose:       2200,
        hideProgressBar: true,
        closeOnClick:    true,
        toastClassName:  "!bg-gradient-to-r !from-yellow-600 !to-orange-600 !text-white !font-bold !rounded-xl",
      });
    }, 650);
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative flex flex-col overflow-hidden cursor-pointer group
                 bg-neutral-900 rounded-2xl border border-neutral-800
                 hover:border-yellow-500/40 transition-all duration-400
                 hover:shadow-[0_8px_40px_-8px_rgba(234,179,8,0.25)]"
      onClick={onClick}
    >
      {/* ── Top accent line ── */}
      <div className="absolute top-0 left-0 right-0 z-20 h-[2px]
                      bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500
                      origin-left scale-x-0 group-hover:scale-x-100
                      transition-transform duration-500 ease-out" />

      {/* ════════════════════════════════════════
          IMAGE SECTION
      ════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden h-52 bg-neutral-800">
        {/* subtle radial glow behind image */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.12)_0%,transparent_70%)]" />

        <Link href={`/${category?.toLowerCase()}/${id}`} className="block h-full" onClick={(e) => e.stopPropagation()}>
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="z-10 object-contain p-5 drop-shadow-2xl"
              priority={false}
            />
          </motion.div>
        </Link>

        {/* ── Discount badge ── */}
        <AnimatePresence>
          {isDiscount && discountPercentage && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-3 left-3 z-20 flex items-center gap-1
                         px-2.5 py-1 rounded-full text-xs font-bold text-white
                         bg-gradient-to-r from-red-500 to-orange-500 shadow-lg"
            >
              <Flame className="w-3 h-3" />
              {discountPercentage}% OFF
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Category badge ── */}
        <div className="absolute bottom-3 left-3 z-10
                        px-2.5 py-1 rounded-full text-[11px] font-semibold
                        text-yellow-300 bg-black/60 backdrop-blur-sm
                        border border-yellow-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
          {category}
        </div>

        {/* ── Rating badge ── */}
        <div className="absolute bottom-3 right-3 z-10
                        px-2.5 py-1 rounded-full text-[11px] font-semibold
                        text-white bg-black/60 backdrop-blur-sm
                        border border-neutral-700 flex items-center gap-1.5">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span>{rating}</span>
          <span className="text-neutral-400">({ratingCount})</span>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CONTENT SECTION
      ════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 gap-3 p-4">

        {/* ── Name + expand toggle ── */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold leading-snug text-white transition-colors group-hover:text-yellow-300 line-clamp-2">
              {name}
            </h3>
            {description && (
              <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1">{description}</p>
            )}
          </div>

          {(showSize || showExtras) && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowDetails((v) => !v); }}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg
                         bg-neutral-800 hover:bg-yellow-500/20 text-neutral-400
                         hover:text-yellow-400 transition-all duration-200 mt-0.5"
              aria-label="Customize"
            >
              <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          )}
        </div>

        {/* ── Customization panel ── */}
        <AnimatePresence initial={false}>
          {showDetails && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pb-1 space-y-3">

                {/* Size selector */}
                {showSize && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">Size</span>
                      {sizeExtra > 0 && (
                        <span className="text-[10px] font-semibold text-yellow-400
                                         bg-yellow-500/10 px-2 py-0.5 rounded-full">
                          +{sizeExtra} EGP
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {sizes.map((size) => {
                        const active = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={(e) => { e.stopPropagation(); setSelectedSize(size); }}
                            className={`relative py-2 rounded-xl text-xs font-bold transition-all duration-200
                              ${active
                                ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-md shadow-yellow-500/25"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-yellow-500/40 hover:text-yellow-400"
                              }`}
                          >
                            <span className="block">{size}</span>
                            {priceBySize[size] > 0 && (
                              <span className={`block text-[9px] mt-0.5 ${active ? "opacity-70" : "opacity-50"}`}>
                                +{priceBySize[size]}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Extras selector */}
                {showExtras && (
                  <div>
                    <span className="block mb-2 text-xs font-semibold tracking-wider uppercase text-neutral-400">
                      Add-ons
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {EXTRAS.map((extra) => {
                        const active = selectedExtras.includes(extra.id);
                        return (
                          <button
                            key={extra.id}
                            onClick={(e) => { e.stopPropagation(); toggleExtra(extra.id); }}
                            className={`flex items-center justify-between px-2.5 py-2 rounded-xl
                                        text-xs transition-all duration-200 border
                              ${active
                                ? "bg-yellow-500/15 border-yellow-500/50 text-yellow-300"
                                : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-yellow-500/30"
                              }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className={`text-sm ${active ? "text-yellow-400" : "text-neutral-500"}`}>
                                {extra.icon}
                              </span>
                              <span>{extra.label}</span>
                            </div>
                            <span className={`font-semibold ${active ? "text-yellow-400" : "text-neutral-500"}`}>
                              +{extra.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════ PRICE + CTA ════════ */}
        <div className="pt-3 mt-auto space-y-3 border-t border-neutral-800/80">

          {/* Price row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                  {totalPrice}
                  <span className="text-sm font-semibold ms-1">EGP</span>
                </span>
                {isDiscount && oldPrice && (
                  <span className="text-xs line-through text-neutral-500">{oldPrice} EGP</span>
                )}
              </div>

              {/* Savings */}
              {isDiscount && oldPrice && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Tag className="w-3 h-3 text-green-400" />
                  <span className="text-[10px] text-green-400 font-semibold">
                    Save {(oldPrice - parseFloat(totalPrice)).toFixed(2)} EGP
                  </span>
                </div>
              )}
            </div>

            {/* Stock + extras summary */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-400/10">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-semibold text-green-400">In Stock</span>
              </div>
              {hasExtras && (
                <span className="text-[10px] text-yellow-400">
                  +{selectedExtras.length} extra{selectedExtras.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <motion.button
            onClick={handleAddToCart}
            disabled={isAdding}
            whileTap={!isAdding ? { scale: 0.97 } : {}}
            className={`relative flex items-center justify-center w-full gap-2 py-3
                        rounded-xl font-bold text-sm overflow-hidden
                        transition-all duration-300 shadow-md
                        ${justAdded
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25"
                          : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-orange-500 hover:shadow-yellow-500/30 hover:shadow-lg"
                        }
                        disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {/* shimmer on hover */}
            <div className="absolute inset-0 bg-white/20 translate-x-[-200%] group-hover:translate-x-[200%]
                            transition-transform duration-700 skew-x-12 pointer-events-none" />

            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 rounded-full border-black/40 border-t-black animate-spin" />
                  <span>Adding…</span>
                </motion.div>
              ) : justAdded ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Added!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <FaCartPlus className="text-base" />
                  <span>Add to Cart</span>
                  <span className="font-normal opacity-60">• {totalPrice} EGP</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Delivery info */}
          <div className="flex items-center justify-center gap-3 text-[10px] text-neutral-500">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" /> Free delivery
            </span>
            <span className="text-neutral-700">•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> 30–45 min
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}