import Title from "./SectionTitle";
import Image from "next/image";
import Link from "next/link";

export default function Offer() {

  return (
    <>
      {/* ================= OFFERS SECTION ================= */}
      <div className="relative flex flex-col items-center w-full min-h-screen px-6 py-20 offer lg:px-20">
        {/* Title */}
        <Title
          imageLeft={"/svgexport-15 (2).svg"}
          imageRight={"/svgexport-15 (3).svg"}
          title={"Offer"}
        />

        <div className="grid w-full grid-cols-1 gap-10 mt-10 md:grid-cols-2">
          {/* UNIVERSAL OFFER CARD STYLE */}
          {[
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
          ].map((offer) => (
            <Link
            href={`/offer/${offer.id}`}
              key={offer.id}
              className="relative flex flex-col items-center w-full p-6 text-center transition-transform duration-700 bg-yellow-500 border-2 border-yellow-600 shadow-xl opacity-90 gap-9 rounded-2xl lg:flex-row hover:shadow-2xl lg:text-left hover:scale-102"
            >
              {/* Discount Label */}
              <span className="absolute px-3 py-1 text-sm font-bold text-white bg-red-600 rounded-lg shadow-md top-3 left-3">
                {offer.discount}
              </span>

              {/* Gift Label */}
              {offer.giftLabel && (
                <span className="absolute px-3 py-1 text-sm font-bold text-white bg-green-600 rounded-lg shadow-md top-3 right-3">
                  {offer.giftLabel}
                </span>
              )}

              {/* IMAGES SECTION */}
              <div className="relative flex items-center justify-center">
                <Image
                  src={offer.img}
                  alt={offer.title}
                  width={100}
                  height={100}
                  className="object-cover w-40 h-40 mx-auto rounded-xl"
                />

                {/* Gift Image */}
                {offer.gift && (
                  <Image
                    src={offer.gift}
                    alt="gift"
                    width={100}
                    height={100}
                    className="absolute bottom-0 object-cover w-24 h-24 rounded-xl -right-8"
                  />
                )}
              </div>

              {/* TEXT SECTION */}
              <div className="flex flex-col items-center lg:items-start">
                <h3 className="text-2xl font-bold text-gray-900">
                  {offer.title}
                </h3>
                <p className="max-w-xs mt-2 text-gray-800">{offer.desc}</p>

                {/* PRICE */}
                <p className="z-40 mt-3 text-xl font-bold text-gray-900">
                  EGP {offer.price}
                  <span className="ml-2 text-sm text-gray-700 line-through">
                    {offer.oldPrice}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
