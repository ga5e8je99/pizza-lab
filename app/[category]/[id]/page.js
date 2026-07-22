"use client";
import Footer from "@/app/Components/Footer";
import Menu from "@/app/Components/Menu";
import Navbar from "@/app/Components/Navbar";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMenu } from "@/app/Context/MenuContext";
import { toast } from "react-toastify";

// Define addons outside component to avoid recreation
const ADDONS = [
  { id: 1, name: "Ranch Sauce", price: 2 },
  { id: 2, name: "Spice Mix", price: 0 },
  { id: 3, name: "Extra Cheese", price: 5 },
  { id: 4, name: "Mushrooms", price: 3 },
  { id: 5, name: "Olives", price: 2 },
  { id: 6, name: "Pepperoni", price: 4 },
];

export default function Page() {
  const products = useMenu();
  const pathName = usePathname();
  const itemId = pathName.split("/")[2];

  // Find product from context
  const productInfo = products
    .flatMap((cat) => cat.items)
    .find((item) => item.id === itemId);

  // State
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState("");

  // Reset state when product changes
  useEffect(() => {
    if (productInfo) {
      setSelectedSize(
        productInfo.sizes && productInfo.sizes.length > 0
          ? productInfo.sizes[0]
          : null,
      );
      setSelectedAddons([]);
      setQuantity(1);
    }
  }, [productInfo]);

  // Show loading or not found if product missing
  if (!productInfo) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-gray-600">Product not found</div>
        </div>
        <Footer />
      </>
    );
  }

  // Determine if product has sizes
  const hasSizes = productInfo.sizes && productInfo.sizes.length > 0;

  // Calculate base price (without addons)
  const getBasePrice = () => {
    let base =
      productInfo.price !== null && productInfo.price !== undefined
        ? parseFloat(productInfo.price)
        : 0;
    if (
      hasSizes &&
      selectedSize &&
      productInfo.priceBySize &&
      productInfo.priceBySize[selectedSize] !== undefined
    ) {
      base += parseFloat(productInfo.priceBySize[selectedSize]);
    }
    return base;
  };

  // Calculate addons price
  const getAddonsPrice = () => {
    return selectedAddons.reduce((total, addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
  };

  const basePrice = getBasePrice();
  const addonsPrice = getAddonsPrice();
  const totalPrice = (basePrice + addonsPrice) * quantity;

  // Discount handling
  let oldTotalPrice = null;
  if (productInfo.isDiscount && productInfo.discountPercentage) {
    const discountPercent = parseFloat(productInfo.discountPercentage) / 100;
    oldTotalPrice = totalPrice / (1 - discountPercent);
  }

  // Unique identifier for cart item (product id + size + addons)
  const getCartItemId = () => {
    const addonsKey = [...selectedAddons].sort().join(",");
    return `${productInfo.id}-${selectedSize || "no-size"}-${addonsKey}`;
  };

  // Handle addon toggle
  const handleAddonToggle = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const order = {
      id: getCartItemId(),
      name: productInfo.name,
      image: productInfo.image,
      size: selectedSize ? selectedSize : null,

      priceWithAddonOnesItem: totalPrice / quantity,
      basePrice: basePrice,
      addons: selectedAddons.map((id) => {
        const addon = ADDONS.find((a) => a.id === id);
        return { id: addon.id, name: addon.name, price: addon.price };
      }),
      quantity: quantity,
      totalPrice: totalPrice,
      oldPrice: oldTotalPrice,
      discountPercentage: productInfo.isDiscount
        ? productInfo.discountPercentage
        : null,
    };

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if item already exists with same properties
    const existingIndex = cart.findIndex((item) => {
      const sameId = item.id === order.id;
      const sameSize = item.size === order.size;

      // Compare addons (sort both to ignore order)
      const sameAddons =
        JSON.stringify(item.addons.sort((a, b) => a.id - b.id)) ===
        JSON.stringify(order.addons.sort((a, b) => a.id - b.id));

      return sameId && sameSize && sameAddons;
    });

    if (existingIndex !== -1) {
      // Update quantity and total price
      cart[existingIndex].quantity += order.quantity;
      cart[existingIndex].totalPrice += order.totalPrice;
      if (cart[existingIndex].oldPrice) {
        cart[existingIndex].oldPrice += order.oldPrice;
      }
    } else {
      cart.push(order);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Item added to cart successfully!");
  };

  // Size label helper
  const getSizeLabel = (size) => {
    const sizeLabels = {
      s: "Small",
      m: "Medium",
      l: "Large",
      xl: "Extra Large",
    };
    return sizeLabels[size] || size.toUpperCase();
  };

  return (
    <>
      <Navbar />
      {notification && (
        <div className="fixed z-50 flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded-lg shadow-lg top-20 right-4 animate-fade-in">
          <Check className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      <div className="px-10 py-8 mx-auto ">
        <div className="grid grid-cols-1 gap-12 mb-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md overflow-hidden bg-yellow-500 shadow-xl rounded-2xl">
              <div className="absolute inset-0 bg-[url('/pizza.png')] bg-cover bg-center opacity-10" />
              <Image
                src={productInfo.image}
                alt={productInfo.name}
                width={500}
                height={500}
                className="relative z-10 object-cover w-full h-auto transition-transform duration-500 hover:scale-105"
              />
              {productInfo.isDiscount && productInfo.discountPercentage && (
                <div className="absolute flex items-center gap-2 px-4 py-2 font-bold text-white bg-red-600 rounded-full top-4 left-4">
                  <span className="text-lg">
                    -{productInfo.discountPercentage}%
                  </span>
                </div>
              )}
            </div>
            <div className="mt-8 text-center lg:text-left">
              <h3 className="mb-4 text-2xl font-bold text-yellow-500">
                Description
              </h3>
              <p className="leading-relaxed text-gray-200">
                {productInfo.description}
              </p>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
              <h1 className="text-3xl font-bold text-yellow-500 md:text-4xl">
                {productInfo.name}
              </h1>
              {productInfo.isDiscount && productInfo.discountPercentage && (
                <div className="px-5 py-2 font-bold text-red-700 bg-red-100 border border-red-300 rounded-full">
                  Save {productInfo.discountPercentage}%
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-4xl font-bold">
                  {totalPrice.toFixed(2)} EGP
                </h2>
                {oldTotalPrice && (
                  <span className="text-2xl font-semibold text-gray-400 line-through">
                    {oldTotalPrice.toFixed(2)} EGP
                  </span>
                )}
              </div>
              {hasSizes && selectedSize && (
                <p className="text-gray-500">
                  Base price: {basePrice.toFixed(2)} EGP (includes size extra)
                </p>
              )}
            </div>

            {/* Size Selector (only if sizes exist) */}
            {hasSizes && (
              <div className="mb-10">
                <h3 className="mb-4 text-xl font-semibold">Choose Size</h3>
                <div className="flex flex-wrap gap-3">
                  {productInfo.sizes.map((size) => {
                    let sizePrice = parseFloat(productInfo.price) || 0;
                    if (
                      productInfo.priceBySize &&
                      productInfo.priceBySize[size]
                    ) {
                      sizePrice += parseFloat(productInfo.priceBySize[size]);
                    }
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedSize === size
                            ? "border-yellow-500 text-yellow-500 font-bold"
                            : "border-gray-300 text-gray-300 hover:border-gray-200"
                        }`}
                      >
                        <div className="font-medium">{getSizeLabel(size)}</div>
                        <div className="text-sm">
                          {sizePrice.toFixed(2)} EGP
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Addons */}
            {pathName.split("/")[1] === "pizza" && (
              <div className="mb-10">
                <h3 className="mb-4 text-xl font-semibold">Add Extras</h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {ADDONS.map((addon) => (
                    <div
                      key={addon.id}
                      onClick={() => handleAddonToggle(addon.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedAddons.includes(addon.id)
                          ? "border-yellow-500 text-yellow-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedAddons.includes(addon.id)
                              ? "bg-yellow-500 border-yellow-500"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {selectedAddons.includes(addon.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{addon.name}</span>
                      </div>
                      <span
                        className={`font-semibold ${
                          addon.price > 0 ? "text-yellow-500" : "text-red-600"
                        }`}
                      >
                        {addon.price > 0 ? `+${addon.price} EGP` : "Free"}
                      </span>
                    </div>
                  ))}
                </div>

                {/*  */}
              </div>
            )}
            {/* Quantity */}
            <div className="flex flex-col items-center justify-center w-full gap-4 mb-10">
              <h3 className="mb-4 text-xl font-semibold">Quantity</h3>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    quantity <= 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {quantity}
                  </div>
                  <div className="mt-1 text-sm">Items</div>
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    quantity >= 10
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 mb-8 border border-yellow-200 rounded-2xl">
              <h3 className="mb-4 text-xl font-semibold">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-200">
                    {productInfo.name}
                    {hasSizes &&
                      selectedSize &&
                      ` (${getSizeLabel(selectedSize)})`}
                  </span>
                  <span className="font-medium">
                    {basePrice.toFixed(2)} EGP
                  </span>
                </div>

                {selectedAddons.length > 0 && (
                  <div>
                    <div className="mb-2 text-gray-200">Addons:</div>
                    <div className="ml-4 space-y-1">
                      {selectedAddons.map((id) => {
                        const addon = ADDONS.find((a) => a.id === id);
                        return (
                          <div key={id} className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              + {addon.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              +{addon.price} EGP
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-gray-300">
                  <span className="text-lg font-semibold">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">
                      {totalPrice.toFixed(2)} EGP
                    </div>
                    <div className="text-sm text-gray-500">
                      for {quantity} item{quantity > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center w-full gap-3 px-6 py-4 font-bold text-gray-900 transition-all duration-200 bg-yellow-500 shadow-lg hover:bg-yellow-600 rounded-xl hover:shadow-xl active:scale-95"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-lg">
                Add to Cart - {totalPrice.toFixed(2)} EGP
              </span>
            </button>

            {/* Ingredients */}
            {productInfo.ingredients && productInfo.ingredients.length > 0 && (
              <div className="pt-8 mt-10 border-t border-gray-200">
                <h3 className="mb-4 text-xl font-semibold">Ingredients</h3>
                <div className="flex flex-wrap gap-3">
                  {productInfo.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full"
                    >
                      {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <hr className="my-12 border-gray-300" /> */}

        {/* You May Also Like */}
        {/* <div className="mb-16">
          <h3 className="mb-10 text-3xl font-bold text-center text-yellow-600">
            You May Also Like
          </h3>
          <Menu />
        </div> */}
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
