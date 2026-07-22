"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Package,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Heart,
  LogOut,
  Award,
  Pizza as PizzaIcon,
} from "lucide-react";
import ProductCard from "../Components/ProductCart";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+20 111 222 3333",
    address: "123 Pizza Street, Cairo, Egypt",
    joinDate: "January 2023",
    avatar: "/avatar.png",
  });

  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      date: "2024-03-15",
      items: ["Double Cheese Pizza", "Coca-Cola"],
      total: 115,
      status: "delivered",
      deliveryTime: "30 min",
    },
    {
      id: "ORD-002",
      date: "2024-03-10",
      items: ["Pepperoni Special", "Garlic Bread", "Fries"],
      total: 145,
      status: "preparing",
      deliveryTime: "45 min",
    },
    {
      id: "ORD-003",
      date: "2024-03-05",
      items: ["BBQ Chicken Pizza", "Salad"],
      total: 95,
      status: "cancelled",
      deliveryTime: "25 min",
    },
  ]);

  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Double Creamy Cheese",
      image: "/offer1.png",
      category: "Pizza",
      price: 199,
      isDiscount: false,
      rating: 4.8,
      ratingCount: 245,
    },
    {
      id: 2,
      name: "Garlic Bread",
      image: "/fries.png",
      category: "Appetizer",
      price: 80,
      isDiscount: false,
      rating: 4.5,
      ratingCount: 189,
    },
    {
      id: 3,
      name: "Coca-Cola",
      image: "/drink.png",
      category: "Drink",
      price: 30,
      isDiscount: false,
      rating: 4.3,
      ratingCount: 320,
    },
  ]);

  const [stats, setStats] = useState({
    totalOrders: 15,
    totalSpent: 1250,
    favoriteItem: "Double Cheese Pizza",
    memberSince: "12 months",
  });

  // بيانات العناوين
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Home",
      address: "123 Pizza Street, Cairo, Egypt",
      isDefault: true,
      phone: "+20 111 222 3333",
    },
    {
      id: 2,
      label: "Work",
      address: "456 Business Tower, New Cairo, Egypt",
      isDefault: false,
      phone: "+20 111 222 4444",
    },
  ]);

  // بيانات المدفوعات
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "card",
      last4: "1234",
      expiry: "12/25",
      brand: "Visa",
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      last4: "5678",
      expiry: "08/26",
      brand: "Mastercard",
      isDefault: false,
    },
  ]);

  // إعدادات الإشعارات
  const [notifications, setNotifications] = useState({
    email: {
      orderUpdates: true,
      promotions: false,
      reminders: true,
    },
    sms: {
      deliveryAlerts: true,
      otp: true,
    },
  });

  // إعدادات الأمان
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30min",
    loginAlerts: true,
  });

  const handleLogout = () => {
    localStorage.removeItem("auth_token_pizza");
    localStorage.removeItem("user");
    console.log("Logging out...");
  };

  const copyInput = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Fallback copy failed:", err);
        }
        document.body.removeChild(textArea);
      });
  };

  // دالة لتغيير الحالة في إعدادات الإشعارات
  const toggleNotification = (type, category, field) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: !prev[type][field],
      },
    }));
  };

  // دالة لتغيير حالة الأمان
  const toggleSecurity = (field) => {
    setSecurity((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSecuritySelect = (field, value) => {
    setSecurity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container px-4 py-12 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-yellow-500 md:text-5xl">
                My Account
              </h1>
              <p className="text-gray-400">
                Manage your profile, orders, and preferences
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 text-red-600 transition-colors border border-red-600 rounded-xl hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky space-y-6 top-20">
              {/* User Card */}
              <div className="p-6 border border-yellow-500 shadow-lg rounded-2xl">
                <div className="flex flex-col items-center mb-6 text-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full opacity-90" />
                    <div className="absolute flex items-center justify-center bg-[#121212] rounded-full inset-2">
                      <User className="w-16 h-16" />
                    </div>
                  </div>
                  <h2 className="mb-1 text-2xl font-bold ">{userData.name}</h2>
                  <p className="mb-4 text-sm text-gray-100">
                    Pizza Lover • Member since {userData.joinDate}
                  </p>
                  <div className="flex items-center gap-2 px-2 py-1 font-semibold bg-yellow-500 opacity-90 text-gray-950 rounded-3xl">
                    500 point - 200 EGP Cash Back
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-100" />
                    <span className="text-gray-300">{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-100" />
                    <span className="text-gray-300">{userData.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 text-gray-100" />
                    <span className="text-gray-300">{userData.address}</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-4 border border-yellow-500 shadow-lg rounded-2xl">
                <nav className="space-y-2">
                  {[
                    { id: "overview", label: "Overview", icon: User },
                    { id: "addresses", label: "Addresses", icon: MapPin },
                    { id: "payments", label: "Payments", icon: CreditCard },
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "security", label: "Security", icon: Shield },
                    { id: "settings", label: "Settings", icon: Settings },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors ${
                        activeTab === tab.id
                          ? "bg-yellow-500 opacity-90 text-white"
                          : "text-gray-100 hover:bg-gray-100 hover:text-gray-950"
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="p-6 border border-gray-200 shadow-lg rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-300">Total Orders</p>
                        <h3 className="text-3xl font-bold text-gray-200">
                          {stats.totalOrders}
                        </h3>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-xl">
                        <Package className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {stats.totalOrders} delicious pizzas delivered
                    </p>
                  </div>

                  <div className="p-6 border border-red-200 shadow-lg rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-300">Total Spent</p>
                        <h3 className="text-3xl font-bold text-gray-200">
                          {stats.totalSpent} EGP
                        </h3>
                      </div>
                      <div className="p-3 bg-red-100 rounded-xl">
                        <CreditCard className="w-8 h-8 text-red-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Average {(stats.totalSpent / stats.totalOrders).toFixed(2)}{" "}
                      EGP per order
                    </p>
                  </div>

                  <div className="p-6 border border-gray-200 shadow-lg rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-300">Member Since</p>
                        <h3 className="text-3xl font-bold text-gray-200">
                          {stats.memberSince}
                        </h3>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-xl">
                        <Award className="w-8 h-8 text-gray-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Loyalty points: 1,250
                    </p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="p-6 border border-yellow-500 shadow-lg rounded-2xl">
                  <h2 className="mb-6 text-2xl font-bold text-yellow-500">
                    My Orders
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 font-medium text-left text-gray-200">
                            Order ID
                          </th>
                          <th className="px-4 py-3 font-medium text-left text-gray-200">
                            Date
                          </th>
                          <th className="px-4 py-3 font-medium text-left text-gray-200">
                            Items
                          </th>
                          <th className="px-4 py-3 font-medium text-left text-gray-200">
                            Total
                          </th>
                          <th className="px-4 py-3 font-medium text-left text-gray-200">
                            Status
                          </th>
                          <th className="px-4 py-3 font-medium text-left text-gray-200">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-100"
                          >
                            <td className="px-4 py-4">
                              <span className="font-medium text-yellow-500">
                                {order.id}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-gray-200">
                              {order.date}
                            </td>
                            <td className="px-4 py-4">
                              <div className="max-w-xs">
                                <p className="text-sm text-gray-200 line-clamp-2">
                                  {order.items.join(", ")}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-bold text-gray-400">
                              {order.total} EGP
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  order.status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "preparing"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <button className="font-medium text-red-600 hover:text-red-700">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Favorites */}
                <div className="p-6 border border-yellow-500 shadow-lg rounded-2xl">
                  <h2 className="mb-6 text-2xl font-bold text-yellow-500">
                    Most Ordered
                  </h2>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((item, index) => (
                      <ProductCard key={index} {...item} />
                    ))}
                  </div>
                </div>

                {/* Special Offer */}
                <div className="p-8 text-white bg-linear-to-r from-yellow-500 to-red-500 rounded-2xl">
                  <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div>
                      <h3 className="mb-2 text-2xl font-bold">
                        🎁 Special Offer!
                      </h3>
                      <p className="mb-4">
                        Get 20% off your next order as a loyal customer!
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-4 py-2 font-mono font-bold rounded-lg bg-white/20">
                          LOYAL20
                        </span>
                        <button
                          onClick={() => copyInput("LOYAL20")}
                          className="px-4 py-2 font-bold text-yellow-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
                        >
                          Copy Code
                        </button>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <PizzaIcon className="w-24 h-24 opacity-90" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="p-6 border border-yellow-500 shadow-lg rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-yellow-500">
                      My Addresses
                    </h2>
                    <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600">
                      <MapPin className="w-4 h-4" />
                      Add New Address
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-xl border ${
                          addr.isDefault
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-200">
                              {addr.label}
                              {addr.isDefault && (
                                <span className="ml-2 text-xs text-yellow-500">
                                  (Default)
                                </span>
                              )}
                            </h3>
                            <p className="mt-1 text-sm text-gray-300">
                              {addr.address}
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                              {addr.phone}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-sm text-yellow-500 hover:text-yellow-400">
                              Edit
                            </button>
                            {!addr.isDefault && (
                              <button className="text-sm text-red-500 hover:text-red-400">
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <div className="p-6 border border-yellow-500 shadow-lg rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-yellow-500">
                      Payment Methods
                    </h2>
                    <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600">
                      <CreditCard className="w-4 h-4" />
                      Add Payment Method
                    </button>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 rounded-xl border ${
                          method.isDefault
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-8 h-8 text-gray-400" />
                            <div>
                              <p className="font-bold text-gray-200">
                                {method.brand} ending in {method.last4}
                              </p>
                              <p className="text-sm text-gray-400">
                                Expires {method.expiry}
                              </p>
                              {method.isDefault && (
                                <span className="text-xs text-yellow-500">
                                  Default payment method
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!method.isDefault && (
                              <button className="text-sm text-yellow-500 hover:text-yellow-400">
                                Set as Default
                              </button>
                            )}
                            <button className="text-sm text-red-500 hover:text-red-400">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="p-6 border border-yellow-500 shadow-lg rounded-2xl">
                  <h2 className="mb-6 text-2xl font-bold text-yellow-500">
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-gray-200">
                        Email Notifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-300">
                              Order Updates
                            </p>
                            <p className="text-sm text-gray-400">
                              Receive email when order status changes
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notifications.email.orderUpdates}
                              onChange={() =>
                                toggleNotification("email", null, "orderUpdates")
                              }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-300">
                              Promotions & Offers
                            </p>
                            <p className="text-sm text-gray-400">
                              Receive exclusive deals and discounts
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notifications.email.promotions}
                              onChange={() =>
                                toggleNotification("email", null, "promotions")
                              }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-300">
                              Order Reminders
                            </p>
                            <p className="text-sm text-gray-400">
                              Remind me to complete my order
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notifications.email.reminders}
                              onChange={() =>
                                toggleNotification("email", null, "reminders")
                              }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="mb-4 text-lg font-semibold text-gray-200">
                        SMS Notifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-300">
                              Delivery Alerts
                            </p>
                            <p className="text-sm text-gray-400">
                              Get SMS when your order is out for delivery
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notifications.sms.deliveryAlerts}
                              onChange={() =>
                                toggleNotification("sms", null, "deliveryAlerts")
                              }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-300">
                              OTP / Verification
                            </p>
                            <p className="text-sm text-gray-400">
                              Receive one-time passwords via SMS
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notifications.sms.otp}
                              onChange={() =>
                                toggleNotification("sms", null, "otp")
                              }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button className="px-8 py-3 font-bold text-white transition-colors bg-yellow-500 rounded-xl hover:bg-yellow-600">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="p-6 border border-yellow-500 shadow-lg rounded-2xl">
                  <h2 className="mb-6 text-2xl font-bold text-yellow-500">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-gray-200">
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
                        <div>
                          <p className="font-medium text-gray-300">
                            Enable 2FA
                          </p>
                          <p className="text-sm text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={security.twoFactor}
                            onChange={() => toggleSecurity("twoFactor")}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-gray-200">
                        Session Timeout
                      </h3>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) =>
                          handleSecuritySelect("sessionTimeout", e.target.value)
                        }
                        className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="15min">15 minutes</option>
                        <option value="30min">30 minutes</option>
                        <option value="1hour">1 hour</option>
                        <option value="never">Never</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-400">
                        Automatically log out after inactivity
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-gray-200">
                        Login Alerts
                      </h3>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
                        <div>
                          <p className="font-medium text-gray-300">
                            Email me on new login
                          </p>
                          <p className="text-sm text-gray-400">
                            Receive an email when a new device logs in
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={security.loginAlerts}
                            onChange={() => toggleSecurity("loginAlerts")}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button className="px-8 py-3 font-bold text-white transition-colors bg-yellow-500 rounded-xl hover:bg-yellow-600">
                        Update Security Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="p-6 border border-yellow-500 shadow-lg rounded-2xl">
                <h2 className="mb-6 text-2xl font-bold text-yellow-500">
                  Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-gray-200">
                      Account Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={userData.name}
                          className="w-full px-4 py-3 text-gray-200 bg-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={userData.email}
                          className="w-full px-4 py-3 text-gray-200 bg-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue={userData.phone}
                          className="w-full px-4 py-3 text-gray-200 bg-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-bold text-gray-200">
                      Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-300">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-400">
                            Receive order updates via email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-300">
                            SMS Notifications
                          </p>
                          <p className="text-sm text-gray-400">
                            Receive delivery updates via SMS
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button className="px-8 py-3 font-bold text-white transition-colors bg-yellow-500 rounded-xl hover:bg-yellow-600">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}