import Wave from "./Wave";
import Link from "next/link";
import Image from "next/image";


import { useState, useEffect } from "react";
export default function Hero() {
  const [animation, setAnimation] = useState(0);
  const images = ["/homeImage.png", "/offer1.png", "/fries.png","/offer2.png"];

  useEffect(() => {
    setTimeout(
      () =>
        animation < images.length-1 ? setAnimation(animation + 1) : setAnimation(0),
      20000
    );
  }, [animation, images.length]);
 
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-screen px-6 py-5 overflow-hidden text-center bg-yellow-500 opacity-90 md:p-20 md:px-20 md:text-left">
      <div className="absolute inset-0 bg-[url('/pizza.png')] bg-cover bg-center opacity-10" />

        <div className="relative z-50 flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
          {/* === TEXT SIDE === */}
          <div className="max-w-md space-y-4 md:static md:translate-0 md:block md:w-1/2 xs:absolute xs:left-1/2 xs:top-1/2 xs:transform xs:-translate-x-1/2 xs:-translate-y-1/2 xs:w-full xs:text-center xs:flex xs:flex-col xs:justify-center xs:items-center">
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              Hot <span className="text-red-600">Pizza</span> House
            </h1>

            <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              <span className="text-red-600">Delivery</span> Service
            </h1>

            <p className="max-w-md text-xl font-semibold leading-relaxed text-gray-900 ">
              Enjoy handcrafted pizzas made with fresh ingredients, baked to
              perfection, and delivered hot to your doorstep.
            </p>

            <Link
              href="#"
              className="inline-block px-6 py-3 mt-4 font-semibold text-white transition bg-red-600 shadow-md text-md rounded-xl hover:bg-red-700"
            >
              Order Now
            </Link>
          </div>

          {/* === IMAGE SIDE === */}
          <div className="relative flex justify-center mt-6 md:w-1/2 md:mt-0">
            <div className="w-[260px] sm:w-[300px] md:w-[420px] flex justify-center">
              <Image
                src={images[animation]}
                width={100}
                height={100}
                alt="Pizza"
                className="w-80 h-80 object-contain drop-shadow-[50px_30px_40px_rgba(0,0,0,0.50)] animate-[float_3s_ease-in-out_infinite] "
              />
            </div>
          </div>
        </div>

        <div className="absolute left-0 w-full -bottom-1 z-90">
          <Wave />
        </div>
      </div>
    </>
  );
}
