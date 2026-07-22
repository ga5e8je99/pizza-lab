"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  Truck,
  Shield,
  Gift,
  Calendar,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import AddressForm from "../Components/AddressSelector";

export default function CartPage() {
  const steps = [
    { id: 1, name: "card" },
    { id: 2, name: "checkout" },
    { id: 3, name: "address" },
    { id: 4, name: "confirm" },
  ];

  const getItemKey = (item) => {
    return `${item.id}-${item.size}-${item.addons
      .map((a) => a.id)
      .sort()
      .join(",")}`;
  };

  const [currentStep, setCurrentStep] = useState(1);
  const searchParams = useSearchParams();

  // Step from URL
  const stepParam = searchParams.get("step");
  useEffect(() => {
    const step = stepParam ? parseInt(stepParam, 10) : 1;
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, [stepParam]);

  const [cartItems, setCartItems] = useState([]);
  const [inputField, setInputField] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [alertPromo, setAlertPromo] = useState("");
  const [currentDiscount, setCurrentDiscount] = useState({
    type: null, // 'percentage' أو 'fixed' أو 'delivery'
    value: 0,
    message: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // حساب الإجماليات
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.priceWithAddonOnesItem * item.quantity,
    0,
  );

  const deliveryFee = 30;
  const tax = subtotal * 0.05;
  const router = useRouter();

  const discountCodes = [
    {
      code: "LGF10",
      alert: "10% discount applied!",
      type: "percentage",
      value: 0.1,
      operation: (amount) => amount * 0.9,
    },
    {
      code: "PIZZ200",
      alert: "200 EGP discount applied!",
      type: "fixed",
      value: 200,
      operation: (amount) => Math.max(0, amount - 200),
    },
    {
      code: "DELIVERYFREE",
      alert: "Delivery fee waived!",
      type: "delivery",
      value: 0,
      operation: (amount, currentDeliveryFee) => amount - currentDeliveryFee,
    },
  ];

  // حساب المجموع النهائي مع مراعاة الخصم
  const calculateTotal = () => {
    const baseAmount = subtotal + deliveryFee + tax;

    if (!appliedPromo || !currentDiscount.type) {
      return baseAmount;
    }

    switch (currentDiscount.type) {
      case "percentage":
        return baseAmount * (1 - currentDiscount.value);
      case "fixed":
        return Math.max(0, baseAmount - currentDiscount.value);
      case "delivery":
        return subtotal + tax;
      default:
        return baseAmount;
    }
  };

  const total = calculateTotal();

  const updateQuantity = (key, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (getItemKey(item) === key) {
          const newTotalPrice = item.priceWithAddonOnesItem * newQuantity;
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newTotalPrice,
          };
        }
        return item;
      }),
    );
  };

  const removeItem = (key) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => getItemKey(item) !== key),
    );
  };

  const applyPromoCode = () => {
    if (!inputField.trim()) {
      setAlertPromo("Please enter a promo code");
      setAppliedPromo(false);
      return;
    }

    const foundCode = discountCodes.find(
      (e) => e.code.toUpperCase() === inputField.toUpperCase(),
    );

    if (!foundCode) {
      setAlertPromo("Code is not correct ❌");
      setAppliedPromo(false);
      setCurrentDiscount({ type: null, value: 0, message: "" });
      return;
    }

    setAppliedPromo(true);
    setAlertPromo(foundCode.alert);
    setCurrentDiscount({
      type: foundCode.type,
      value: foundCode.value,
      message: foundCode.alert,
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(false);
    setInputField("");
    setAlertPromo("");
    setCurrentDiscount({ type: null, value: 0, message: "" });
  };

  const handelSteps = (step) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
      router.push(`?step=${step}`, { scroll: false });
      router.refresh();
    }
  };

  // التحقق من صحة بيانات العنوان
  const isAddressValid = () => {
    return addressData && addressData.street && addressData.city;
  };

  // تقديم الطلب
  const placeOrder = async () => {
    if (!isAddressValid()) {
      alert("Please complete your address details.");
      return;
    }

    setIsPlacingOrder(true);
    // هنا يمكنك استدعاء API لتخزين الطلب
    // مثال:
    // const orderData = {
    //   items: cartItems,
    //   subtotal,
    //   deliveryFee,
    //   tax,
    //   total,
    //   discount: appliedPromo ? currentDiscount : null,
    //   payment: paymentForm,
    //   address: addressData,
    // };
    // const response = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) });
    // if (response.ok) {
    //   localStorage.removeItem('cart');
    //   router.push('/order-success');
    // } else {
    //   alert('Error placing order');
    // }

    // محاكاة نجاح الطلب
    setTimeout(() => {
      localStorage.removeItem("cart");
      alert("Order placed successfully! (Demo)");
      router.push("/order-success"); // قم بإنشاء هذه الصفحة
      setIsPlacingOrder(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container px-4 py-12 mx-auto max-w-7xl">
        {/* رأس الصفحة */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/menu"
              className="flex items-center gap-2 text-gray-200 transition-colors hover:text-yellow-600"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Menu</span>
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-yellow-500 md:text-5xl">
                Your Shopping Cart
              </h1>
              <p className="text-lg text-gray-400">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={clearCart}
                className="px-6 py-3 text-red-600 transition-colors border border-red-600 rounded-xl hover:bg-red-50"
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </button>
              <Link
                href="/menu"
                className="px-6 py-3 font-bold text-white transition-colors bg-yellow-500 opacity-90 rounded-xl hover:bg-yellow-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center">
            <div className="inline-flex p-6 mb-6 bg-yellow-100 rounded-full">
              <ShoppingCart className="w-16 h-16 text-yellow-600" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-200">
              Your cart is empty
            </h2>
            <p className="max-w-md mx-auto mb-8 text-gray-600">
              Looks like you haven&apos;t added any delicious pizzas to your
              cart yet.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white transition-colors bg-yellow-500 opacity-90 rounded-xl hover:bg-yellow-600"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* المحتوى حسب الخطوة */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={getItemKey(item)}
                      className="p-6 transition-shadow bg-yellow-500 border border-yellow-200 shadow-lg opacity-90 rounded-2xl hover:shadow-xl"
                    >
                      <div className="flex flex-col gap-6 md:flex-row">
                        <div className="relative w-full h-40 overflow-hidden md:w-40 rounded-xl">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain md:object-cover"
                            sizes="(max-width: 768px) 100vw, 160px"
                          />
                          <div className="absolute px-3 py-1 text-sm font-bold text-white rounded-full bg-linear-to-br from-red-500 to-red-600 top-3 left-3">
                            {item.size === "s"
                              ? "small"
                              : item.size === "m"
                              ? "medium"
                              : item.size === "l"
                              ? "large"
                              : "x-large"}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div className="flex-1">
                              <h3 className="mb-2 text-xl font-bold text-gray-900">
                                {item.name}
                              </h3>
                              {item.addons.length > 0 && (
                                <div className="mb-4">
                                  <p className="mb-2 text-sm text-gray-600">
                                    Add-ons:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.addons.map((addon, index) => (
                                      <span
                                        key={index}
                                        className="px-3 py-1 text-sm text-gray-100 bg-red-600 rounded-full"
                                      >
                                        {addon.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-4">
                              <p className="text-2xl font-bold text-gray-900">
                                {item.totalPrice.toFixed(2)} EGP
                              </p>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 px-4 py-2 bg-red-600 rounded-xl">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        getItemKey(item),
                                        item.quantity - 1,
                                      )
                                    }
                                    className="p-1 text-gray-900 transition-colors rounded hover:bg-gray-200"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="font-bold text-center min-w-5">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        getItemKey(item),
                                        item.quantity + 1,
                                      )
                                    }
                                    className="p-1 text-gray-900 transition-colors rounded hover:bg-gray-200"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(getItemKey(item))}
                                  className="p-2 text-red-600 transition-colors hover:bg-red-50 rounded-xl"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                            <p className="text-gray-600">
                              {item.priceWithAddonOnesItem.toFixed(2)} EGP each
                            </p>
                            {item.addons.length > 0 && (
                              <p className="text-sm text-gray-600">
                                Price without addons:{" "}
                                {item.basePrice.toFixed(2)} EGP
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="p-6 border border-yellow-500 shadow-md rounded-2xl">
                  <h3 className="mb-6 text-2xl font-bold text-yellow-600">
                    Payment Details
                  </h3>
                  <form
                    className="space-y-5"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div>
                      <label
                        htmlFor="cardName"
                        className="block mb-1 text-sm font-medium text-gray-100"
                      >
                        Name on Card
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute w-5 h-5 text-gray-200 transform -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          id="cardName"
                          value={paymentForm.cardName}
                          onChange={(e) => {
                            setPaymentForm({
                              ...paymentForm,
                              cardName: e.target.value,
                            });
                            if (paymentErrors.cardName)
                              setPaymentErrors({
                                ...paymentErrors,
                                cardName: "",
                              });
                          }}
                          placeholder="John Doe"
                          className="w-full py-2 pl-10 pr-4 transition border border-gray-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      {paymentErrors.cardName && (
                        <p className="mt-1 text-xs text-red-500">
                          {paymentErrors.cardName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block mb-1 text-sm font-medium text-gray-200"
                      >
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute w-5 h-5 text-gray-200 transform -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          id="cardNumber"
                          value={paymentForm.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16);
                            const formatted = value.replace(
                              /(\d{4})(?=\d)/g,
                              "$1 ",
                            );
                            setPaymentForm({
                              ...paymentForm,
                              cardNumber: formatted,
                            });
                            if (paymentErrors.cardNumber)
                              setPaymentErrors({
                                ...paymentErrors,
                                cardNumber: "",
                              });
                          }}
                          placeholder="1234 5678 9012 3456"
                          className="w-full py-2 pl-10 pr-4 transition border border-gray-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      {paymentErrors.cardNumber && (
                        <p className="mt-1 text-xs text-red-500">
                          {paymentErrors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="expiry"
                          className="block mb-1 text-sm font-medium text-gray-200"
                        >
                          Expiry Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute w-5 h-5 text-gray-200 transform -translate-y-1/2 left-3 top-1/2" />
                          <input
                            type="text"
                            id="expiry"
                            value={paymentForm.expiry}
                            onChange={(e) => {
                              let value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4);
                              if (value.length >= 3) {
                                value = value.slice(0, 2) + "/" + value.slice(2);
                              }
                              setPaymentForm({ ...paymentForm, expiry: value });
                              if (paymentErrors.expiry)
                                setPaymentErrors({
                                  ...paymentErrors,
                                  expiry: "",
                                });
                            }}
                            placeholder="MM/YY"
                            className="w-full py-2 pl-10 pr-4 transition border border-gray-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                        </div>
                        {paymentErrors.expiry && (
                          <p className="mt-1 text-xs text-red-500">
                            {paymentErrors.expiry}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="cvc"
                          className="block mb-1 text-sm font-medium text-gray-200"
                        >
                          CVC
                        </label>
                        <div className="relative">
                          <Lock className="absolute w-5 h-5 text-gray-200 transform -translate-y-1/2 left-3 top-1/2" />
                          <input
                            type="text"
                            id="cvc"
                            value={paymentForm.cvc}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4);
                              setPaymentForm({ ...paymentForm, cvc: value });
                              if (paymentErrors.cvc)
                                setPaymentErrors({ ...paymentErrors, cvc: "" });
                            }}
                            placeholder="123"
                            className="w-full py-2 pl-10 pr-4 transition border border-gray-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          />
                        </div>
                        {paymentErrors.cvc && (
                          <p className="mt-1 text-xs text-red-500">
                            {paymentErrors.cvc}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="flex items-center gap-1 text-xs text-gray-200">
                      <Shield className="w-3 h-3" /> Your payment information is
                      secure. We do not store card details.
                    </p>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => handelSteps(1)}
                        className="px-6 py-2 text-gray-100 transition border border-gray-100 rounded-lg hover:bg-gray-100"
                      >
                        Back to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const errors = {};
                          if (!paymentForm.cardName.trim())
                            errors.cardName = "Name is required";
                          if (!paymentForm.cardNumber.trim())
                            errors.cardNumber = "Card number is required";
                          else if (
                            paymentForm.cardNumber.replace(/\s/g, "").length !==
                            16
                          )
                            errors.cardNumber = "Must be 16 digits";
                          if (!paymentForm.expiry.trim())
                            errors.expiry = "Expiry date is required";
                          else {
                            const [month, year] = paymentForm.expiry.split("/");
                            const now = new Date();
                            const currentYear = now.getFullYear() % 100;
                            const currentMonth = now.getMonth() + 1;
                            if (
                              !month ||
                              !year ||
                              month < 1 ||
                              month > 12 ||
                              year.length !== 2 ||
                              year < currentYear ||
                              (year == currentYear && month < currentMonth)
                            ) {
                              errors.expiry = "Invalid expiry date";
                            }
                          }
                          if (!paymentForm.cvc.trim())
                            errors.cvc = "CVC is required";
                          else if (paymentForm.cvc.length < 3)
                            errors.cvc = "Must be 3-4 digits";

                          setPaymentErrors(errors);
                          if (Object.keys(errors).length === 0) {
                            handelSteps(3);
                          }
                        }}
                        className="px-6 py-2 font-semibold text-white transition bg-yellow-500 rounded-lg hover:bg-yellow-600"
                      >
                        Continue to Address
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {currentStep === 3 && (
                <div className="p-6 border border-yellow-500 shadow-md rounded-2xl">
                  <h3 className="mb-6 text-2xl font-bold text-yellow-600">
                    Delivery Address
                  </h3>
                  <AddressForm
                    onAddressChange={(data) => setAddressData(data)}
                    initialAddress={addressData}
                  />
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={() => handelSteps(2)}
                      className="px-6 py-2 text-gray-100 transition border border-gray-100 rounded-lg hover:bg-gray-100"
                    >
                      Back to Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (isAddressValid()) {
                          handelSteps(4);
                        } else {
                          alert("Please complete your address details.");
                        }
                      }}
                      className="px-6 py-2 font-semibold text-white transition bg-yellow-500 rounded-lg hover:bg-yellow-600"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="p-6 border border-yellow-500 shadow-md rounded-2xl">
                  <h3 className="mb-6 text-2xl font-bold text-yellow-600">
                    Confirm Your Order
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-200">
                        Delivery Address
                      </h4>
                      <div className="p-4 mt-2 bg-gray-800 rounded-lg">
                        <p className="text-gray-300">
                          {addressData?.street}, {addressData?.district}
                        </p>
                        <p className="text-gray-300">
                          {addressData?.city}, {addressData?.state}{" "}
                          {addressData?.zipCode}
                        </p>
                        {addressData?.additionalDetails && (
                          <p className="mt-1 text-sm text-gray-400">
                            {addressData.additionalDetails}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-200">
                        Payment Method
                      </h4>
                      <div className="p-4 mt-2 bg-gray-800 rounded-lg">
                        <p className="text-gray-300">
                          Card ending in ****
                          {paymentForm.cardNumber.slice(-4)}
                        </p>
                        <p className="text-gray-300">
                          {paymentForm.cardName}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => handelSteps(3)}
                        className="px-6 py-2 text-gray-100 transition border border-gray-100 rounded-lg hover:bg-gray-100"
                      >
                        Edit Address
                      </button>
                      <button
                        onClick={placeOrder}
                        disabled={isPlacingOrder}
                        className="px-6 py-2 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {isPlacingOrder ? "Placing Order..." : "Place Order"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ملخص الطلب (يظهر في جميع الخطوات) */}
            <div className="lg:col-span-1">
              <div className="sticky space-y-6 top-22">
                <div className="p-6 border border-yellow-500 shadow-lg rounded-2xl">
                  <h2 className="mb-6 text-2xl font-bold text-yellow-500">
                    Order Summary
                  </h2>

                  <div className="mb-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-100">Subtotal</span>
                      <span className="font-medium">
                        {subtotal.toFixed(2)} EGP
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-100">Delivery Fee</span>
                      <span
                        className={
                          deliveryFee === 0 ||
                          currentDiscount.type === "delivery"
                            ? "text-green-600 font-medium"
                            : "font-medium"
                        }
                      >
                        {currentDiscount.type === "delivery"
                          ? "FREE"
                          : deliveryFee === 0
                          ? "FREE"
                          : `${deliveryFee.toFixed(2)} EGP`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-100">Tax (5%)</span>
                      <span className="font-medium">{tax.toFixed(2)} EGP</span>
                    </div>

                    {appliedPromo && currentDiscount.type && (
                      <div className="flex justify-between">
                        <span className="text-green-600">
                          {currentDiscount.type === "percentage"
                            ? "Discount (10%)"
                            : currentDiscount.type === "fixed"
                            ? "Discount"
                            : "Delivery Discount"}
                        </span>
                        <span className="font-bold text-green-600">
                          -
                          {(currentDiscount.type === "percentage"
                            ? (subtotal + deliveryFee + tax) *
                              currentDiscount.value
                            : currentDiscount.type === "fixed"
                            ? currentDiscount.value
                            : deliveryFee
                          ).toFixed(2)}{" "}
                          EGP
                        </span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-300">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-yellow-600">
                          {total.toFixed(2)} EGP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputField}
                        onChange={(e) => setInputField(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        disabled={appliedPromo}
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={appliedPromo}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          appliedPromo
                            ? "bg-green-100 text-green-700 cursor-not-allowed"
                            : "bg-gray-900 text-white hover:bg-black"
                        }`}
                      >
                        {appliedPromo ? "Applied" : "Apply"}
                      </button>
                    </div>
                    {alertPromo && (
                      <p
                        className={`mt-2 text-sm ${
                          appliedPromo ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {appliedPromo ? "🎉 " : ""}
                        {alertPromo}
                      </p>
                    )}
                    {appliedPromo && (
                      <button
                        onClick={() => {
                          setAppliedPromo(false);
                          setInputField("");
                          setAlertPromo("");
                          setCurrentDiscount({
                            type: null,
                            value: 0,
                            message: "",
                          });
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove promo code
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (currentStep === 1) handelSteps(2);
                      else if (currentStep === 2) handelSteps(3);
                      else if (currentStep === 3) {
                        if (isAddressValid()) handelSteps(4);
                        else alert("Please complete address");
                      } else if (currentStep === 4) placeOrder();
                    }}
                    className="block w-full py-4 mb-4 font-bold text-center text-white transition-colors bg-yellow-500 opacity-90 rounded-xl hover:bg-yellow-600"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {currentStep === 4 ? (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          Place Order
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Proceed to{" "}
                          {currentStep === 1
                            ? "Checkout"
                            : currentStep === 2
                            ? "Address"
                            : "Confirmation"}
                        </>
                      )}
                    </div>
                  </button>

                  <p className="text-sm text-center text-gray-400">
                    You won&apos;t be charged until you review your order
                  </p>
                </div>

                <div className="p-6 border border-yellow-200 bg-yellow-50 rounded-2xl">
                  <h3 className="mb-3 font-bold text-gray-900">
                    🎁 Special Offer!
                  </h3>
                  <p className="mb-4 text-gray-700">
                    Add 2 drinks to your order and get 15% off your next pizza!
                  </p>
                  <Link
                    href="/menu/drinks"
                    className="inline-block font-medium text-yellow-600 hover:text-yellow-700"
                  >
                    Browse Drinks →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}