"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiGrid,
  FiShoppingBag,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiClock,
  FiPhone,
  FiMapPin,
  FiSearch,
  FiRefreshCw,
  FiSettings,
  FiTag,
  FiDollarSign,
  FiTrendingUp,
  FiLock,
  FiLogOut,
  FiExternalLink,
  FiLayers,
  FiX,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

const DEFAULT_PIN = "pizza2026";
const DEFAULT_API_URL = "http://localhost:3000";

export default function PizzaDashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [savedPin, setSavedPin] = useState(DEFAULT_PIN);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);

  // App navigation
  const [activeTab, setActiveTab] = useState("orders"); // orders | menu | categories | offers | settings
  const [orderFilter, setOrderFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState({});

  // Loading & sync
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const lastOrderCountRef = useRef(0);

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeOrderDetails, setActiveOrderDetails] = useState(null);

  // Form states
  const [itemForm, setItemForm] = useState({
    name: "",
    nameAr: "",
    category: "Pizza",
    description: "",
    image: "",
    priceType: "sized", // 'sized' or 'fixed'
    fixedPrice: "",
    priceS: 50,
    priceM: 80,
    priceL: 110,
    priceXL: 140,
    ingredients: "",
    isDiscount: false,
    oldPrice: "",
    discountPercentage: "",
    isAvailable: true,
    popular: false,
  });

  const [promoForm, setPromoForm] = useState({
    code: "",
    discountType: "percentage",
    value: 10,
    minOrder: 100,
    active: true,
  });

  const [offerForm, setOfferForm] = useState({
    title: "",
    titleAr: "",
    desc: "",
    price: 150,
    oldPrice: 190,
    discount: "20% OFF",
    giftLabel: "+ Free Drink",
    image: "",
    active: true,
  });

  const [newCatName, setNewCatName] = useState("");
  const [newCatNameAr, setNewCatNameAr] = useState("");

  // Sound alert for new orders
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  // Init auth and settings
  useEffect(() => {
    const authStored = localStorage.getItem("pizza_dash_auth") === "true";
    const localPin = localStorage.getItem("pizza_dash_pin") || DEFAULT_PIN;
    const localUrl = localStorage.getItem("pizza_api_url") || DEFAULT_API_URL;
    setSavedPin(localPin);
    setApiUrl(localUrl);
    if (authStored) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Fetch all data from backend
  const fetchData = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [resOrders, resMenu, resStats, resOffers, resSettings] = await Promise.all([
        fetch(`${apiUrl}/api/orders`).then((r) => r.json()),
        fetch(`${apiUrl}/api/menu`).then((r) => r.json()),
        fetch(`${apiUrl}/api/stats`).then((r) => r.json()),
        fetch(`${apiUrl}/api/offers`).then((r) => r.json()),
        fetch(`${apiUrl}/api/settings`).then((r) => r.json()),
      ]);

      if (resOrders.success) {
        // Check if new orders arrived
        if (
          lastOrderCountRef.current > 0 &&
          resOrders.orders.length > lastOrderCountRef.current
        ) {
          playAlertSound();
        }
        lastOrderCountRef.current = resOrders.orders.length;
        setOrders(resOrders.orders || []);
      }

      if (resMenu.success) {
        setMenuItems(resMenu.data || []);
        setCategories(resMenu.categories || []);
      }

      if (resStats.success) {
        setStats(resStats.stats);
      }

      if (resOffers.success) {
        setOffers(resOffers.offers || []);
        setPromoCodes(resOffers.promoCodes || []);
      }

      if (resSettings.success) {
        setSettings(resSettings.settings || {});
      }

      setIsConnected(true);
    } catch (err) {
      console.error("Fetch error:", err);
      setIsConnected(false);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  // Live polling every 5 seconds for orders
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();

    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, apiUrl]);

  // Auth Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === savedPin) {
      setIsAuthenticated(true);
      localStorage.setItem("pizza_dash_auth", "true");
      setPinError("");
      setPinInput("");
    } else {
      setPinError("رمز المرور غير صحيح. الرمز الافتراضي: pizza2026");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("pizza_dash_auth");
  };

  // Order Handlers
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (activeOrderDetails && activeOrderDetails.id === orderId) {
          setActiveOrderDetails((prev) => ({ ...prev, status: newStatus }));
        }
        fetchData(true);
      } else {
        alert("فشل تحديث حالة الطلب: " + data.error);
      }
    } catch (err) {
      alert("خطأ في الاتصال بالسيرفر");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("هل أنت متأكد من حذف هذا الأوردر نهائياً؟")) return;
    try {
      const res = await fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (activeOrderDetails?.id === orderId) setActiveOrderDetails(null);
        fetchData(true);
      }
    } catch (err) {
      alert("خطأ في حذف الطلب");
    }
  };

  // Item Handlers
  const handleOpenItemModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      const isSized = Boolean(item.priceBySize);
      setItemForm({
        name: item.name || "",
        nameAr: item.nameAr || "",
        category: item.category || "Pizza",
        description: item.description || "",
        image: item.image || "",
        priceType: isSized ? "sized" : "fixed",
        fixedPrice: item.price || "",
        priceS: item.priceBySize?.s || 50,
        priceM: item.priceBySize?.m || 80,
        priceL: item.priceBySize?.l || 110,
        priceXL: item.priceBySize?.xl || 140,
        ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(", ") : "",
        isDiscount: Boolean(item.isDiscount),
        oldPrice: item.oldPrice || "",
        discountPercentage: item.discountPercentage || "",
        isAvailable: item.isAvailable !== false,
        popular: Boolean(item.popular),
      });
    } else {
      setEditingItem(null);
      setItemForm({
        name: "",
        nameAr: "",
        category: categories[0]?.name || "Pizza",
        description: "",
        image: "",
        priceType: "sized",
        fixedPrice: "",
        priceS: 50,
        priceM: 80,
        priceL: 110,
        priceXL: 140,
        ingredients: "",
        isDiscount: false,
        oldPrice: "",
        discountPercentage: "",
        isAvailable: true,
        popular: false,
      });
    }
    setShowItemModal(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name.trim()) {
      alert("يرجى إدخال اسم الصنف");
      return;
    }

    const payload = {
      name: itemForm.name,
      nameAr: itemForm.nameAr || itemForm.name,
      category: itemForm.category,
      description: itemForm.description,
      image: itemForm.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
      ingredients: itemForm.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isDiscount: itemForm.isDiscount,
      oldPrice: itemForm.oldPrice ? Number(itemForm.oldPrice) : null,
      discountPercentage: itemForm.discountPercentage ? Number(itemForm.discountPercentage) : null,
      isAvailable: itemForm.isAvailable,
      popular: itemForm.popular,
    };

    if (itemForm.priceType === "sized") {
      payload.priceBySize = {
        s: Number(itemForm.priceS) || 0,
        m: Number(itemForm.priceM) || 0,
        l: Number(itemForm.priceL) || 0,
        xl: Number(itemForm.priceXL) || 0,
      };
      payload.sizes = ["s", "m", "l", "xl"];
      payload.price = null;
    } else {
      payload.price = Number(itemForm.fixedPrice) || 0;
      payload.priceBySize = null;
      payload.sizes = [];
    }

    try {
      let res;
      if (editingItem) {
        res = await fetch(`${apiUrl}/api/menu/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiUrl}/api/menu`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setShowItemModal(false);
        fetchData();
      } else {
        alert("فشل حفظ الصنف: " + data.error);
      }
    } catch (err) {
      alert("خطأ في الاتصال بالسيرفر");
    }
  };

  const toggleItemAvailability = async (item) => {
    const newStatus = item.isAvailable === false ? true : false;
    try {
      const res = await fetch(`${apiUrl}/api/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isAvailable: newStatus } : i))
        );
      }
    } catch (err) {
      alert("خطأ في تحديث التوفر");
    }
  };

  const deleteItem = async (itemId) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف من المنيو؟")) return;
    try {
      const res = await fetch(`${apiUrl}/api/menu/${itemId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
        fetchData(true);
      }
    } catch (err) {
      alert("خطأ في حذف الصنف");
    }
  };

  // Add Category Handler
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await fetch(`${apiUrl}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), nameAr: newCatNameAr.trim() || newCatName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCatName("");
        setNewCatNameAr("");
        setShowCategoryModal(false);
        fetchData();
      }
    } catch (err) {
      alert("خطأ في إضافة التصنيف");
    }
  };

  // Add Promo Code Handler
  const handleSavePromo = async (e) => {
    e.preventDefault();
    if (!promoForm.code.trim()) return;
    try {
      const res = await fetch(`${apiUrl}/api/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "promo",
          code: promoForm.code.trim().toUpperCase(),
          discountType: promoForm.discountType,
          value: Number(promoForm.value),
          minOrder: Number(promoForm.minOrder),
          active: promoForm.active,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowPromoModal(false);
        setPromoForm({ code: "", discountType: "percentage", value: 10, minOrder: 100, active: true });
        fetchData();
      }
    } catch (err) {
      alert("خطأ في حفظ كود الخصم");
    }
  };

  const deletePromo = async (code) => {
    if (!confirm(`هل أنت متأكد من حذف كود الخصم ${code}؟`)) return;
    try {
      await fetch(`${apiUrl}/api/offers/${code}`, { method: "DELETE" });
      setPromoCodes((prev) => prev.filter((p) => p.code !== code));
    } catch (err) {
      alert("خطأ في حذف الكود");
    }
  };

  // Save Settings Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        alert("تم حفظ إعدادات المطعم بنجاح!");
      }
    } catch (err) {
      alert("خطأ في حفظ الإعدادات");
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "all" || o.status === orderFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.phone?.includes(q) ||
      o.customer?.city?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Filtered menu
  const filteredMenu = menuItems.filter((i) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      i.name.toLowerCase().includes(q) ||
      i.nameAr?.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { label: "قيد المراجعة", bg: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" };
      case "preparing":
        return { label: "جاري التجهيز بالفرن", bg: "bg-blue-500/15 text-blue-400 border-blue-500/30", dot: "bg-blue-400" };
      case "on_the_way":
        return { label: "في الطريق للتوصيل", bg: "bg-purple-500/15 text-purple-400 border-purple-500/30", dot: "bg-purple-400" };
      case "delivered":
        return { label: "تم التوصيل بنجاح", bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" };
      case "cancelled":
        return { label: "ملغي", bg: "bg-rose-500/15 text-rose-400 border-rose-500/30", dot: "bg-rose-400" };
      default:
        return { label: status, bg: "bg-stone-800 text-stone-300", dot: "bg-stone-400" };
    }
  };

  // -------------------------
  // RENDER: LOGIN / PIN SCREEN
  // -------------------------
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md p-8 overflow-hidden rounded-3xl bg-stone-900/90 border border-stone-800 shadow-2xl backdrop-blur-xl text-center">
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-amber-500/15 text-amber-500 ring-8 ring-amber-500/10 shadow-lg">
            <FiLock className="w-9 h-9" />
          </div>

          <h1 className="text-2xl font-black text-white">لوحة تحكم بيتزا لاب</h1>
          <p className="mt-2 text-sm text-stone-400">
            أدخل رمز المرور السري (PIN) للدخول إلى إدارة الطلبات والمحتوى
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="أدخل الرمز (الافتراضي: pizza2026)"
                className="w-full px-5 py-4 text-center font-mono text-xl tracking-widest text-white rounded-2xl bg-stone-950/80 border border-stone-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-sm placeholder:tracking-normal placeholder:font-sans placeholder:text-stone-600"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-medium">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 text-base font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] transition-all rounded-2xl shadow-lg shadow-amber-500/20"
            >
              تسجيل الدخول
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-500">
            <span>Pizza Lab Standalone Dashboard</span>
            <span className="font-mono">Port: 3001</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // RENDER: DASHBOARD
  // -------------------------
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900/95 border-b md:border-b-0 md:border-l border-stone-800/80 flex flex-col shrink-0 z-30">
        <div className="p-5 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-black shadow-md shadow-amber-500/20 text-lg">
              <FiShoppingBag className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h2 className="text-base font-black text-white leading-tight">Pizza Lab</h2>
              <span className="text-[11px] text-amber-400 font-medium">لوحة الإدارة الشاملة</span>
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "إيقاف صوت الإشعارات" : "تفعيل صوت الإشعارات"}
            className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            {soundEnabled ? <FiVolume2 className="w-4 h-4 text-amber-400" /> : <FiVolumeX className="w-4 h-4 text-stone-500" />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === "orders"
                ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                : "text-stone-300 hover:bg-stone-800/60 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <FiShoppingBag className="w-5 h-5" />
              <span>إدارة الطلبات</span>
            </div>
            {orders.filter((o) => o.status === "pending").length > 0 && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                  activeTab === "orders"
                    ? "bg-stone-950 text-amber-400"
                    : "bg-amber-500 text-stone-950 animate-pulse"
                }`}
              >
                {orders.filter((o) => o.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("menu")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === "menu"
                ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                : "text-stone-300 hover:bg-stone-800/60 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <FiGrid className="w-5 h-5" />
              <span>المنيو والأصناف</span>
            </div>
            <span className="text-xs opacity-75">{menuItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === "categories"
                ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                : "text-stone-300 hover:bg-stone-800/60 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <FiLayers className="w-5 h-5" />
              <span>التصنيفات</span>
            </div>
            <span className="text-xs opacity-75">{categories.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("offers")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === "offers"
                ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                : "text-stone-300 hover:bg-stone-800/60 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <FiTag className="w-5 h-5" />
              <span>العروض وأكواد الخصم</span>
            </div>
            <span className="text-xs opacity-75">{promoCodes.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === "settings"
                ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                : "text-stone-300 hover:bg-stone-800/60 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <FiSettings className="w-5 h-5" />
              <span>إعدادات المطعم</span>
            </div>
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-800/80 space-y-2">
          <a
            href={apiUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-stone-800/60 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors border border-stone-700/50"
          >
            <span>فتح موقع العملاء</span>
            <FiExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-black text-white">
                {activeTab === "orders" && "إدارة الطلبات الواردة (Live Orders)"}
                {activeTab === "menu" && "إدارة المنيو والبيتزا والأصناف"}
                {activeTab === "categories" && "إدارة تصنيفات القائمة"}
                {activeTab === "offers" && "العروض الترويجية وأكواد الخصم"}
                {activeTab === "settings" && "إعدادات المطعم والربط"}
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                {isConnected ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    متصل بالسيرفر المباشر ({apiUrl})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    غير متصل بالسيرفر (تأكد من تشغيل pizaa-lab)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم، الهاتف، الرقم..."
                className="w-full pr-10 pl-4 py-2 text-xs rounded-xl bg-stone-900 border border-stone-800 focus:outline-none focus:border-amber-500 text-white placeholder:text-stone-600"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchData()}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-white transition-all disabled:opacity-50"
              title="تحديث البيانات"
            >
              <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
            </button>
          </div>
        </header>

        {/* Quick KPI Stats Bar */}
        <section className="p-6 pb-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400 font-medium">إجمالي الطلبات</p>
              <h3 className="text-2xl font-black text-white mt-1">{stats?.totalOrders || orders.length}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400 font-medium">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">
                {stats?.totalRevenue || orders.reduce((sum, o) => sum + (o.status !== "cancelled" ? o.total : 0), 0)} <span className="text-xs">ج.م</span>
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FiDollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400 font-medium">طلبات قيد التجهيز</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">
                {orders.filter((o) => o.status === "pending" || o.status === "preparing").length}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FiClock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400 font-medium">أصناف المنيو</p>
              <h3 className="text-2xl font-black text-white mt-1">{menuItems.length}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-stone-800 text-stone-300 flex items-center justify-center">
              <FiGrid className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Dynamic Tab Body */}
        <div className="p-6 flex-1">
          {/* TAB 1: ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Order Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { key: "all", label: "جميع الطلبات", count: orders.length },
                  { key: "pending", label: "جديد (قيد المراجعة)", count: orders.filter((o) => o.status === "pending").length },
                  { key: "preparing", label: "في الفرن (جاري التحضير)", count: orders.filter((o) => o.status === "preparing").length },
                  { key: "on_the_way", label: "في الطريق للتوصيل", count: orders.filter((o) => o.status === "on_the_way").length },
                  { key: "delivered", label: "تم التسليم", count: orders.filter((o) => o.status === "delivered").length },
                  { key: "cancelled", label: "ملغي", count: orders.filter((o) => o.status === "cancelled").length },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setOrderFilter(f.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                      orderFilter === f.key
                        ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                        : "bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800"
                    }`}
                  >
                    <span>{f.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        orderFilter === f.key ? "bg-stone-950 text-amber-400" : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Orders Grid */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800/80">
                  <FiShoppingBag className="w-16 h-16 text-stone-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-stone-300">لا توجد طلبات في هذه الحالة</h3>
                  <p className="text-xs text-stone-500 mt-1">أي طلب جديد يقوم العميل بطلبه سيظهر هنا في الوقت الفعلي</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {filteredOrders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    return (
                      <div
                        key={order.id}
                        className="rounded-3xl bg-stone-900/90 border border-stone-800/90 hover:border-stone-700/90 transition-all p-5 shadow-xl flex flex-col justify-between"
                      >
                        {/* Order Header */}
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-stone-800/70">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-amber-400 text-sm">
                                  {order.id}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${badge.bg}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                  {badge.label}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                                <FiClock className="w-3 h-3 text-stone-500" />
                                {new Date(order.createdAt).toLocaleString("ar-EG", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </p>
                            </div>

                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="حذف الأوردر"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Customer Info */}
                          <div className="py-3 border-b border-stone-800/70 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold">{order.customer?.name}</span>
                              <a
                                href={`tel:${order.customer?.phone}`}
                                className="inline-flex items-center gap-1 text-amber-400 hover:underline font-mono"
                              >
                                <FiPhone className="w-3 h-3" />
                                {order.customer?.phone}
                              </a>
                            </div>

                            <div className="text-stone-300 flex items-start gap-1">
                              <FiMapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                              <span>
                                {order.customer?.city && `${order.customer.city} - `}
                                {order.customer?.street}
                                {order.customer?.building && ` (عمارة ${order.customer.building})`}
                                {order.customer?.apartment && ` (شقة ${order.customer.apartment})`}
                              </span>
                            </div>

                            {order.customer?.notes && (
                              <p className="text-amber-300/80 text-[11px] bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                                ملاحظة: &quot;{order.customer.notes}&quot;
                              </p>
                            )}
                          </div>

                          {/* Items List */}
                          <div className="py-3 border-b border-stone-800/70">
                            <p className="text-[11px] font-bold text-stone-400 mb-2">الأصناف المطلوبة:</p>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                              {order.items?.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-stone-950/60 border border-stone-800/40"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-400 font-bold flex items-center justify-center text-[10px]">
                                      {item.quantity}x
                                    </span>
                                    <span className="text-stone-200 font-medium">{item.name}</span>
                                    {item.size && (
                                      <span className="text-[10px] text-stone-400 uppercase font-mono">
                                        ({item.size})
                                      </span>
                                    )}
                                  </div>
                                  <span className="font-bold text-amber-400 text-xs">
                                    {item.price * item.quantity} ج.م
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Pricing Summary */}
                          <div className="pt-3 pb-3 flex items-center justify-between text-xs">
                            <div className="space-y-0.5 text-stone-400">
                              <span>طريقة الدفع: </span>
                              <span className="text-stone-200 font-bold">
                                {order.paymentMethod === "card" ? "فيزا / كارت" : "كاش عند الاستلام"}
                              </span>
                            </div>
                            <div className="text-left">
                              <span className="text-[11px] text-stone-400 block">الإجمالي الكلي:</span>
                              <span className="text-xl font-black text-amber-400">{order.total} ج.م</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Action Workflow Buttons */}
                        <div className="pt-3 border-t border-stone-800/70 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, "pending")}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              order.status === "pending"
                                ? "bg-amber-500 text-stone-950 shadow-sm"
                                : "bg-stone-800 hover:bg-stone-700 text-stone-300"
                            }`}
                          >
                            مراجعة
                          </button>

                          <button
                            onClick={() => updateOrderStatus(order.id, "preparing")}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              order.status === "preparing"
                                ? "bg-blue-500 text-white shadow-sm"
                                : "bg-stone-800 hover:bg-stone-700 text-stone-300"
                            }`}
                          >
                            في الفرن
                          </button>

                          <button
                            onClick={() => updateOrderStatus(order.id, "on_the_way")}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              order.status === "on_the_way"
                                ? "bg-purple-500 text-white shadow-sm"
                                : "bg-stone-800 hover:bg-stone-700 text-stone-300"
                            }`}
                          >
                            للتوصيل
                          </button>

                          <button
                            onClick={() => updateOrderStatus(order.id, "delivered")}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              order.status === "delivered"
                                ? "bg-emerald-500 text-stone-950 font-black shadow-sm"
                                : "bg-stone-800 hover:bg-stone-700 text-stone-300"
                            }`}
                          >
                            تم التسليم
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MENU & PRODUCTS */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">قائمة الأطعمة والأصناف</h2>
                  <p className="text-xs text-stone-400">تحكم كامل في الأسعار والأحجام وتوفر الأصناف بالمنيو</p>
                </div>

                <button
                  onClick={() => handleOpenItemModal()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>إضافة صنف جديد</span>
                </button>
              </div>

              {/* Items Table / Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-stone-900/90 border border-stone-800 overflow-hidden flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-600">
                            <FiGrid className="w-12 h-12" />
                          </div>
                        )}

                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-900/90 backdrop-blur-md text-amber-400 border border-stone-800">
                            {item.category}
                          </span>
                          {item.isDiscount && (
                            <span className="px-2 py-1 rounded-full text-[10px] font-black bg-rose-500 text-white">
                              خصم {item.discountPercentage}%
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => toggleItemAvailability(item)}
                          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md transition-all flex items-center gap-1 ${
                            item.isAvailable !== false
                              ? "bg-emerald-500/80 text-white"
                              : "bg-rose-500/80 text-white"
                          }`}
                        >
                          {item.isAvailable !== false ? (
                            <>
                              <FiEye className="w-3 h-3" /> متاح للطلب
                            </>
                          ) : (
                            <>
                              <FiEyeOff className="w-3 h-3" /> غير متاح
                            </>
                          )}
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-white text-base">{item.name}</h3>
                            {item.nameAr && (
                              <p className="text-xs text-stone-400 font-medium">{item.nameAr}</p>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-stone-400 line-clamp-2">{item.description}</p>

                        {/* Price Details */}
                        <div className="pt-2">
                          {item.priceBySize ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-mono">
                              <span className="text-stone-400 font-sans">الأحجام:</span>
                              <span className="px-1.5 py-0.5 rounded bg-stone-950 text-amber-400 font-bold">
                                S: {item.priceBySize.s}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-stone-950 text-amber-400 font-bold">
                                M: {item.priceBySize.m}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-stone-950 text-amber-400 font-bold">
                                L: {item.priceBySize.l}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-stone-950 text-amber-400 font-bold">
                                XL: {item.priceBySize.xl}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-amber-400">{item.price} ج.م</span>
                              {item.oldPrice && (
                                <span className="text-xs text-stone-500 line-through">
                                  {item.oldPrice} ج.م
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t border-stone-800/50 mt-3">
                      <button
                        onClick={() => handleOpenItemModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
                      >
                        <FiEdit className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">تصنيفات القائمة</h2>
                  <p className="text-xs text-stone-400">إضافة وإدارة أقسام المنيو المعروضة للزبائن</p>
                </div>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>إضافة تصنيف جديد</span>
                </button>
              </div>

              <div className="space-y-3">
                {categories.map((cat) => {
                  const itemsCount = menuItems.filter(
                    (i) => i.category.toLowerCase() === cat.name.toLowerCase()
                  ).length;
                  return (
                    <div
                      key={cat.id || cat.name}
                      className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm">
                          <FiLayers className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                          <span className="text-xs text-stone-400">{cat.nameAr || cat.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-mono bg-stone-950 text-stone-300 border border-stone-800">
                          {itemsCount} صنف
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: OFFERS & PROMO CODES */}
          {activeTab === "offers" && (
            <div className="space-y-8">
              {/* Promo Codes Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">أكواد الخصم (Promo Codes)</h2>
                    <p className="text-xs text-stone-400">أكواد يكتبها العميل في صفحة السلة للحصول على تخفيض</p>
                  </div>

                  <button
                    onClick={() => setShowPromoModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>إضافة كود خصم</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {promoCodes.map((promo) => (
                    <div
                      key={promo.code}
                      className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between shadow-md relative overflow-hidden"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                            {promo.code}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              promo.active
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-stone-800 text-stone-500"
                            }`}
                          >
                            {promo.active ? "نشط" : "معطل"}
                          </span>
                        </div>

                        <p className="text-sm font-bold text-white mt-2">
                          {promo.type === "percentage"
                            ? `خصم ${promo.value}%`
                            : promo.type === "delivery"
                            ? "توصيل مجاني"
                            : `خصم ${promo.value} ج.م`}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-1">
                          الحد الأدنى للأوردر: {promo.minOrder || 0} ج.م
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-800/80 flex items-center justify-end mt-4">
                        <button
                          onClick={() => deletePromo(promo.code)}
                          className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Banners / Offers */}
              <div className="space-y-4 pt-6 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">العروض الخاصة (Special Offers)</h2>
                    <p className="text-xs text-stone-400">بطاقات العروض الكبيرة المعروضة في الصفحة الرئيسية</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {offers.map((off) => (
                    <div
                      key={off.id}
                      className="rounded-3xl bg-stone-900 border border-stone-800 overflow-hidden shadow-xl"
                    >
                      <div className="h-40 bg-stone-950 relative">
                        {off.image && (
                          <img src={off.image} alt={off.title} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs">
                          {off.discount}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-white">{off.title}</h4>
                        {off.giftLabel && (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-xs font-semibold">
                            {off.giftLabel}
                          </span>
                        )}
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-lg font-black text-amber-400">{off.price} ج.م</span>
                          {off.oldPrice && (
                            <span className="text-xs text-stone-500 line-through">{off.oldPrice} ج.م</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RESTAURANT SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">إعدادات المطعم والربط</h2>
                <p className="text-xs text-stone-400">تعديل بيانات المطعم ورسوم التوصيل والربط مع الواجهة</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">اسم المطعم</label>
                    <input
                      type="text"
                      value={settings.restaurantName || ""}
                      onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-300 mb-1">رقم الهاتف</label>
                      <input
                        type="text"
                        value={settings.phone || ""}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-300 mb-1">رسوم التوصيل الافتراضية (ج.م)</label>
                      <input
                        type="number"
                        value={settings.deliveryFee || 30}
                        onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">شريط الإعلانات أعلى الموقع</label>
                    <input
                      type="text"
                      value={settings.announcement || ""}
                      onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm block">حالة المطعم (مفتوح / مغلق)</span>
                      <span className="text-xs text-stone-400">التحكم في إمكانية استقبال الطلبات</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, isOpen: !settings.isOpen })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        settings.isOpen !== false
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {settings.isOpen !== false ? "مفتوح ويستقبل طلبات" : "مغلق مؤقتاً"}
                    </button>
                  </div>
                </div>

                {/* API & Security config */}
                <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                  <h3 className="font-bold text-white text-sm">إعدادات الاتصال والأمان</h3>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">رابط السيرفر الأساسي (Backend URL)</label>
                    <input
                      type="text"
                      value={apiUrl}
                      onChange={(e) => {
                        setApiUrl(e.target.value);
                        localStorage.setItem("pizza_api_url", e.target.value);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">تغيير رمز المرور (PIN)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="أدخل PIN جديد..."
                        onBlur={(e) => {
                          if (e.target.value.trim().length >= 4) {
                            setSavedPin(e.target.value.trim());
                            localStorage.setItem("pizza_dash_pin", e.target.value.trim());
                            alert("تم تحديث رمز الـ PIN بنجاح!");
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                >
                  حفظ جميع الإعدادات
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ----------------- MODALS ----------------- */}

      {/* MODAL: ADD / EDIT ITEM */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-stone-900 border border-stone-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h3 className="font-bold text-white text-base">
                {editingItem ? "تعديل الصنف" : "إضافة صنف جديد إلى المنيو"}
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">الاسم بالإنجليزية *</label>
                  <input
                    type="text"
                    required
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    placeholder="e.g. Ranch Chicken Pizza"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">الاسم بالعربية</label>
                  <input
                    type="text"
                    value={itemForm.nameAr}
                    onChange={(e) => setItemForm({ ...itemForm, nameAr: e.target.value })}
                    placeholder="مثال: بيتزا رانش دجاج"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">التصنيف</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.nameAr || c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">نوع التسعير</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setItemForm({ ...itemForm, priceType: "sized" })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        itemForm.priceType === "sized"
                          ? "bg-amber-500 text-stone-950"
                          : "bg-stone-950 text-stone-400 border border-stone-800"
                      }`}
                    >
                      أحجام (S,M,L,XL)
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemForm({ ...itemForm, priceType: "fixed" })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        itemForm.priceType === "fixed"
                          ? "bg-amber-500 text-stone-950"
                          : "bg-stone-950 text-stone-400 border border-stone-800"
                      }`}
                    >
                      سعر ثابت
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Inputs */}
              {itemForm.priceType === "sized" ? (
                <div className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
                  <p className="text-xs font-bold text-amber-400">أسعار الأحجام (ج.م):</p>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-1">Small (S)</span>
                      <input
                        type="number"
                        value={itemForm.priceS}
                        onChange={(e) => setItemForm({ ...itemForm, priceS: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-center text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-1">Medium (M)</span>
                      <input
                        type="number"
                        value={itemForm.priceM}
                        onChange={(e) => setItemForm({ ...itemForm, priceM: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-center text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-1">Large (L)</span>
                      <input
                        type="number"
                        value={itemForm.priceL}
                        onChange={(e) => setItemForm({ ...itemForm, priceL: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-center text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-1">X-Large (XL)</span>
                      <input
                        type="number"
                        value={itemForm.priceXL}
                        onChange={(e) => setItemForm({ ...itemForm, priceXL: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-center text-xs font-bold text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">السعر (ج.م) *</label>
                  <input
                    type="number"
                    value={itemForm.fixedPrice}
                    onChange={(e) => setItemForm({ ...itemForm, fixedPrice: e.target.value })}
                    placeholder="مثال: 60"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">رابط صورة الصنف (URL)</label>
                <input
                  type="url"
                  value={itemForm.image}
                  onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">المكونات (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={itemForm.ingredients}
                  onChange={(e) => setItemForm({ ...itemForm, ingredients: e.target.value })}
                  placeholder="cheese, tomato sauce, chicken, ranch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">الوصف</label>
                <textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="وصف مختصر وجذاب..."
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable}
                    onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>متاح للطلب الآن</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                  <input
                    type="checkbox"
                    checked={itemForm.popular}
                    onChange={(e) => setItemForm({ ...itemForm, popular: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>صنف مميز (Popular)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20"
                >
                  حفظ الصنف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-stone-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-bold text-white text-base">إضافة تصنيف جديد</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">اسم التصنيف بالإنجليزية *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Pasta"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">اسم التصنيف بالعربية</label>
                <input
                  type="text"
                  value={newCatNameAr}
                  onChange={(e) => setNewCatNameAr(e.target.value)}
                  placeholder="مثال: مكرونة وباستا"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  إضافة التصنيف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROMO CODE */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-stone-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-bold text-white text-base">إضافة كود خصم جديد</h3>
              <button
                onClick={() => setShowPromoModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">رمز الكود *</label>
                <input
                  type="text"
                  required
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                  placeholder="e.g. VIP25"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs uppercase font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">النوع</label>
                  <select
                    value={promoForm.discountType}
                    onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ج.م)</option>
                    <option value="delivery">توصيل مجاني</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">القيمة</label>
                  <input
                    type="number"
                    value={promoForm.value}
                    onChange={(e) => setPromoForm({ ...promoForm, value: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">الحد الأدنى لقيمة الأوردر (ج.م)</label>
                <input
                  type="number"
                  value={promoForm.minOrder}
                  onChange={(e) => setPromoForm({ ...promoForm, minOrder: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  حفظ الكود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

