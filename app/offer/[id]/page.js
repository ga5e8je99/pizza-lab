"use client";
import { useParams, notFound } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCartPlus, FaCheese } from "react-icons/fa";
import { GiSaucepan, GiChiliPepper, GiMushroomGills } from "react-icons/gi";
import { toast } from "react-toastify";
import { offersData } from "../../lib/OffersData";
import Navbar from "@/app/Components/Navbar";
// Extras data (same as ProductCard)
const extras = [
  { id: "ranch", label: "Ranch", icon: <GiSaucepan />, price: 5 },
  { id: "spice", label: "Spice", icon: <GiChiliPepper />, price: 3 },
  { id: "cheese", label: "Cheese", icon: <FaCheese />, price: 8 },
  { id: "mushroom", label: "Mushrooms", icon: <GiMushroomGills />, price: 6 },
];

export default function OfferDetailPage() {
  const { id } = useParams();
  const offer = offersData.find((item) => item.id === parseInt(id));

  if (!offer) {
    notFound();
  }

  const [selectedExtras, setSelectedExtras] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const toggleExtra = (extraId) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  // Calculate total price with extras and apply discount
  const calculateTotalPrice = () => {
    const extrasTotal = selectedExtras.reduce((sum, extraId) => {
      const extra = extras.find((e) => e.id === extraId);
      return sum + (extra ? extra.price : 0);
    }, 0);
    let subtotal = offer.price + extrasTotal;
    // offer.price is already after discount, but if we want to apply discount again? Actually offer.price is final discounted price.
    // To be consistent with ProductCard, we should keep price as base and apply discount separately.
    // However, for simplicity, we treat offer.price as the discounted base price.
    // Extras are added on top without discount.
    return subtotal.toFixed(2);
  };

  const totalPrice = calculateTotalPrice();

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsAdding(true);

    setTimeout(() => {
      setIsAdding(false);
      toast.success(`✨ ${offer.title} added to cart!`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        toastClassName:
          "!bg-linear-to-r !from-yellow-600 !to-orange-600 !text-white !font-bold !rounded-xl",
      });

      // Build cart item
      const getCartItemId = () => {
        const extrasKey = [...selectedExtras].sort().join(",");
        return `offer-${offer.id}-${extrasKey}`;
      };

      const quantity = 1;
      const extrasTotal = selectedExtras.reduce((sum, extraId) => {
        const extra = extras.find((e) => e.id === extraId);
        return sum + (extra ? extra.price : 0);
      }, 0);
      const basePrice = offer.price; // discounted base price
      const totalPriceWithExtras = basePrice + extrasTotal;

      const order = {
        id: getCartItemId(),
        name: offer.title,
        image: offer.img,
        size: null, // offers might not have sizes
        priceWithAddonOnesItem: totalPriceWithExtras,
        basePrice: basePrice,
        addons: selectedExtras.map((id) => {
          const addon = extras.find((a) => a.id === id);
          return { id: addon.id, name: addon.name, price: addon.price };
        }),
        quantity: quantity,
        totalPrice: totalPriceWithExtras,
        oldPrice: offer.oldPrice + extrasTotal, // old price + extras
        discountPercentage: offer.discountPercentage,
      };

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");

      const existingIndex = cart.findIndex((item) => {
        const sameId = item.id === order.id;
        const sameAddons =
          JSON.stringify(item.addons.sort((a, b) => a.id - b.id)) ===
          JSON.stringify(order.addons.sort((a, b) => a.id - b.id));
        return sameId && sameAddons;
      });

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += order.quantity;
        cart[existingIndex].totalPrice += order.totalPrice;
        if (cart[existingIndex].oldPrice) {
          cart[existingIndex].oldPrice += order.oldPrice;
        }
      } else {
        cart.push(order);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    }, 800);
  };

  return (
    <div className="min-h-screen px-6 py-20 bg-neutral-900 lg:px-20">
        <Navbar/>
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-yellow-400 transition-colors hover:text-yellow-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to offers
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left column: Images */}
          <div className="relative">
            <div className="relative p-8 overflow-hidden aspect-square rounded-2xl bg-linear-to-br from-yellow-600/20 to-orange-600/20">
              <Image
                src={offer.img}
                alt={offer.title}
                fill
                className="object-contain p-4"
              />
              {offer.gift && (
                <div className="absolute w-32 h-32 p-2 border -bottom-4 -right-4 rounded-xl bg-neutral-800/90 backdrop-blur-sm border-yellow-500/30">
                  <Image
                    src={offer.gift}
                    alt="gift"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="absolute flex flex-col gap-2 top-4 left-4">
              <span className="px-3 py-1.5 text-sm font-bold text-white bg-red-600 rounded-lg shadow-md">
                {offer.discount}
              </span>
            </div>
            {offer.giftLabel && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 text-sm font-bold text-white bg-green-600 rounded-lg shadow-md">
                  {offer.giftLabel}
                </span>
              </div>
            )}
          </div>

          {/* Right column: Details */}
          <div className="flex flex-col">
            <h1 className="mb-2 text-4xl font-bold text-white">{offer.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-yellow-500 rounded-full" />
              <span className="text-sm text-neutral-400">{offer.category}</span>
            </div>
            <p className="mb-6 leading-relaxed text-neutral-300">{offer.desc}</p>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-yellow-400">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {offer.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-3 py-1 text-sm rounded-full bg-neutral-800 text-neutral-300"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Extras (similar to ProductCard) */}
            <div className="mb-6">
              <span className="flex items-center gap-1 mb-2 text-sm font-medium text-neutral-300">
                <span className="text-yellow-400">✨</span> Add extras
              </span>
              <div className="grid grid-cols-2 gap-2">
                {extras.map((extra) => (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg transition-all
                      ${
                        selectedExtras.includes(extra.id)
                          ? "bg-yellow-500/20 border border-yellow-500/50"
                          : "bg-neutral-800 border border-neutral-700 hover:border-yellow-500/30"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          selectedExtras.includes(extra.id) ? "text-yellow-400" : "text-neutral-400"
                        }`}
                      >
                        {extra.icon}
                      </span>
                      <span className="text-sm text-neutral-300">{extra.label}</span>
                    </div>
                    <span className="text-xs text-yellow-400">+{extra.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Order */}
            <div className="pt-6 mt-auto border-t border-neutral-800">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-transparent bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text">
                  {totalPrice} EGP
                </span>
                <span className="text-lg line-through text-neutral-500">
                  {offer.oldPrice} EGP
                </span>
                {selectedExtras.length > 0 && (
                  <span className="text-sm text-yellow-400">
                    +{selectedExtras.length} extra{selectedExtras.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="relative flex items-center justify-center w-full gap-2 py-4 overflow-hidden font-bold text-black transition-all duration-300 shadow-lg bg-linear-to-r from-yellow-500 to-orange-500 rounded-xl hover:shadow-xl hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="absolute inset-0 transition-transform duration-500 origin-left transform scale-x-0 bg-white group-hover:scale-x-100 opacity-20" />
                {isAdding ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black rounded-full border-t-transparent animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <FaCartPlus className="text-xl transition-transform group-hover:scale-110 group-hover:rotate-12" />
                    <span>Add to Cart</span>
                    <span className="ml-1 text-sm opacity-75">
                      • {totalPrice} EGP
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-neutral-500">
                <span>🚚 Free delivery</span>
                <span>•</span>
                <span>⚡ {offer.preparationTime}</span>
                <span>•</span>
                <span>🔥 {offer.calories}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}