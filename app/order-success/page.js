"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Truck,
  CheckCheck,
  ShoppingBag,
  ArrowRight,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Live polling for status changes every 4 seconds
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  const stages = [
    { key: "pending", label: "تم استلام الطلب", labelEn: "Order Received", icon: Clock },
    { key: "preparing", label: "جاري التجهيز بالفرن", labelEn: "In Kitchen", icon: ChefHat },
    { key: "on_the_way", label: "في الطريق للتوصيل", labelEn: "Out for Delivery", icon: Truck },
    { key: "delivered", label: "تم التوصيل بنجاح", labelEn: "Delivered", icon: CheckCheck },
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "preparing":
        return 1;
      case "on_the_way":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(order?.status || "pending");

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <main className="container max-w-4xl px-4 py-12 mx-auto">
        {/* Header Confirmation Card */}
        <div className="relative p-8 overflow-hidden text-center border rounded-3xl bg-linear-to-b from-neutral-900 to-neutral-900/80 border-neutral-800 shadow-2xl">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-20 h-20 mb-5 rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="mb-2 text-3xl font-extrabold text-white md:text-4xl">
            شكراً لطلبك! تم إرسال الأوردر بنجاح
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            لقد استلمنا طلبك وجاري مراجعته والبدء في تحضيره في الفرن بأفضل المكونات الطازجة.
          </p>

          {orderId && (
            <div className="inline-block mt-4 px-4 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/80 text-yellow-400 text-sm font-mono font-semibold">
              رقم الأوردر: {orderId}
            </div>
          )}
        </div>

        {/* Live Order Tracker */}
        <div className="p-6 md:p-8 mt-8 border rounded-3xl bg-neutral-900/90 border-neutral-800 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">حالة الطلب المباشرة</h2>
              <p className="text-xs text-gray-400 mt-1">يتم التحديث تلقائياً فور تغيير حالة الطلب من المطعم</p>
            </div>
            <span className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              تتبع مباشر
            </span>
          </div>

          {order?.status === "cancelled" ? (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold">تم إلغاء هذا الطلب</p>
                <p className="text-xs text-red-300/80">يرجى التواصل مع خدمة العملاء لمزيد من التفاصيل.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-1 bg-neutral-800 -z-0 hidden md:block">
                <div
                  className="h-full bg-yellow-500 transition-all duration-700 ease-out"
                  style={{
                    width: `${(Math.max(0, currentStageIdx) / (stages.length - 1)) * 100}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {stages.map((st, i) => {
                  const Icon = st.icon;
                  const isDone = currentStageIdx >= i;
                  const isCurrent = currentStageIdx === i;

                  return (
                    <div
                      key={st.key}
                      className={`flex md:flex-col items-center gap-4 text-right md:text-center p-4 md:p-2 rounded-2xl md:rounded-none transition-all ${
                        isCurrent
                          ? "bg-yellow-500/10 md:bg-transparent border md:border-none border-yellow-500/30"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-md ${
                          isDone
                            ? "bg-yellow-500 text-neutral-950 font-bold ring-4 ring-yellow-500/20"
                            : "bg-neutral-800 text-gray-500"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-bold ${
                            isDone ? "text-yellow-400" : "text-gray-400"
                          }`}
                        >
                          {st.label}
                        </p>
                        <p className="text-xs text-gray-400">{st.labelEn}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Summary */}
        {order && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Customer & Address */}
            <div className="p-6 border rounded-3xl bg-neutral-900/90 border-neutral-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-500" />
                بيانات التوصيل
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-neutral-800/60">
                  <span className="text-gray-400">اسم المستلم:</span>
                  <span className="font-semibold text-white">{order.customer?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-800/60">
                  <span className="text-gray-400">رقم الهاتف:</span>
                  <span className="font-semibold text-white">{order.customer?.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-800/60">
                  <span className="text-gray-400">المدينة / المنطقة:</span>
                  <span className="font-semibold text-white">{order.customer?.city}</span>
                </div>
                <div className="py-2">
                  <span className="text-gray-400 block mb-1">العنوان بالتفصيل:</span>
                  <p className="text-white font-medium bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/50">
                    {order.customer?.street}
                    {order.customer?.building && ` - عمارة: ${order.customer.building}`}
                    {order.customer?.floor && ` - طابق: ${order.customer.floor}`}
                    {order.customer?.apartment && ` - شقة: ${order.customer.apartment}`}
                  </p>
                </div>
                {order.customer?.notes && (
                  <div className="py-2">
                    <span className="text-gray-400 block mb-1">ملاحظات التوصيل:</span>
                    <p className="text-yellow-400/90 text-xs italic bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/50">
                      &quot;{order.customer.notes}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Financials & Items */}
            <div className="p-6 border rounded-3xl bg-neutral-900/90 border-neutral-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-yellow-500" />
                  ملخص الأصناف المطلوبة
                </h3>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/40 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-yellow-500/10 text-yellow-400 font-bold flex items-center justify-center text-xs">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          {item.size && (
                            <span className="text-[11px] text-gray-400 uppercase">
                              الحجم: {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-yellow-400">
                        {item.price * item.quantity} ج.م
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-800 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>المجموع الفرعي:</span>
                  <span>{order.subtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>خدمة التوصيل:</span>
                  <span>{order.deliveryFee} ج.م</span>
                </div>
                {order.discount && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>الخصم المطبق:</span>
                    <span>- {order.discount.amount || order.discount.value || 0} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-neutral-800 text-base font-extrabold text-white">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-yellow-400 text-lg">{order.total} ج.م</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 pt-1">
                  <span>طريقة الدفع:</span>
                  <span className="capitalize font-semibold text-gray-300">
                    {order.paymentMethod === "card" ? "بطاقة بنكية / فيزا" : "الدفع كاش عند الاستلام"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-all bg-linear-to-r from-yellow-500 to-yellow-600 rounded-2xl hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/20"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>طلب المزيد من المنيو</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-gray-300 transition-all border rounded-2xl border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:text-white"
          >
            <span>العودة للرئيسية</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-yellow-500">
          جاري تحميل بيانات الأوردر...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

