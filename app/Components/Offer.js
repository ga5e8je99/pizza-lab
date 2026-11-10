"use client";

import { useState, useEffect } from "react";
import Title from "./SectionTitle";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const DEFAULT_OFFERS = [
  {
    id: 1,
    img: "/offer1.png",
    gift: "/cola.png",
    giftLabel: "+ Free Cola",
    title: "Pepperoni Pizza Special",
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
    title: "Veggie Mix Feast",
    desc: "Fresh mushrooms, olives, peppers & cheese.",
    price: 169,
    oldPrice: 199,
    discount: "15% OFF",
  },
  {
    id: 3,
    img: "/offer3.png",
    gift: "/offer3.png",
    giftLabel: "+ Extra Cheesy Bread",
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
    desc: "Smoky BBQ sauce with tender grilled chicken.",
    price: 179,
    oldPrice: 259,
    discount: "30% OFF",
  },
];

export default function Offer() {
  const [offers, setOffers] = useState(DEFAULT_OFFERS);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch("/api/offers");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.offers && json.offers.length > 0) {
            const mapped = json.offers.map((off) => ({
              id: off.id,
              img: off.image || off.img || "/offer1.png",
              gift: off.gift || null,
              giftLabel: off.giftLabel || null,
              title: off.title,
              desc: off.desc,
              price: off.price,
              oldPrice: off.oldPrice,
              discount: off.discount || `${off.discountPercentage}% OFF`,
            }));
            setOffers(mapped);
          }
        }
      } catch (e) {
        // fallback to default
      }
    }
    loadOffers();
  }, []);

  return (
    <section className="relative flex flex-col items-center w-full px-6 py-16 offer lg:px-20 bg-neutral-950/40">
      {/* Title */}
      <Title
        imageLeft={"/svgexport-15 (2).svg"}
        imageRight={"/svgexport-15 (3).svg"}
        title={"Exclusive Offers"}
      />

      <div className="grid w-full grid-cols-1 gap-8 mt-10 md:grid-cols-2">
        {offers.map((offer) => (
          <Link
            href={`/offer/${offer.id}`}
            key={offer.id}
            className="group relative flex flex-col sm:flex-row items-center w-full p-6 text-center sm:text-left transition-all duration-300 bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 border border-amber-400/30 shadow-xl rounded-3xl gap-6 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            {/* Discount Badge */}
            <span className="absolute px-3 py-1 text-xs font-black text-white bg-red-600 rounded-full shadow-md top-4 left-4">
              {offer.discount}
            </span>

            {/* Gift Label */}
            {offer.giftLabel && (
              <span className="absolute px-3 py-1 text-xs font-bold text-white bg-emerald-700 rounded-full shadow-md top-4 right-4 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {offer.giftLabel}
              </span>
            )}

            {/* Images */}
            <div className="relative flex items-center justify-center shrink-0 mt-6 sm:mt-0">
              <div className="w-36 h-36 rounded-2xl overflow-hidden bg-neutral-950/20 p-2 shadow-inner">
                <img
                  src={offer.img}
                  alt={offer.title}
                  className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Gift Overlay */}
              {offer.gift && (
                <div className="absolute -bottom-2 -right-3 w-16 h-16 rounded-xl bg-white/90 p-1 shadow-lg">
                  <img
                    src={offer.gift}
                    alt="gift"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* Text Details */}
            <div className="flex flex-col items-center sm:items-start flex-1">
              <h3 className="text-2xl font-black text-neutral-950 group-hover:text-black">
                {offer.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-neutral-900/90 line-clamp-2">
                {offer.desc}
              </p>

              {/* Pricing & CTA */}
              <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-neutral-950/15">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-neutral-950">
                    {offer.price} EGP
                  </span>
                  {offer.oldPrice && (
                    <span className="text-sm font-bold text-neutral-800/70 line-through">
                      {offer.oldPrice} EGP
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-neutral-950 bg-white/40 px-3 py-1.5 rounded-xl group-hover:bg-white transition-colors">
                  <span>طلب العرض</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
