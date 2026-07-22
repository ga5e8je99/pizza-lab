"use client";
import { useState, useEffect, useMemo } from "react";
import Loading from "../Components/Loading";
import Image from "next/image";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Wave from "../Components/Wave";
import {
  ChefHat,
  Clock,
  Heart,
  Star,
  Award,
  Shield,
  Truck,
  Users,
  Flame,
  Leaf,
  Pizza as PizzaIcon,
  Dessert,
  
} from "lucide-react";

// استيراد الصور
import PizzaImage from "@/public/offer1.png";
import OvenImage from "@/public/oven.jpg";
import DeliveryImage from "@/public/delivery.png";
import LoveImage from "@/public/love.png";
import Chef1Image from "@/public/chef.png";
import Chef2Image from "@/public/chef2.png";
import Chef3Image from "@/public/chef3.png";

export default function About() {
  const [loading, setLoading] = useState(true);
  const [activeValue, setActiveValue] = useState(0);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // بيانات القيم
  const values = useMemo(
    () => [
      {
        title: "Fresh Ingredients",
        description:
          "We use only the finest and freshest ingredients for a delicious and memorable flavor.",
        icon: Leaf,
        color: "green",
      },
      {
        title: "Quality First",
        description:
          "Our team is dedicated to giving you the best pizza ordering and dining experience.",
        icon: Award,
        color: "yellow",
      },
      {
        title: "Customer Happiness",
        description:
          "Your satisfaction is our top priority — we ensure fast, smooth, and enjoyable service.",
        icon: Heart,
        color: "red",
      },
      {
        title: "Fast Delivery",
        description:
          "Hot and fresh pizza delivered right to your door in record time.",
        icon: Truck,
        color: "blue",
      },
      {
        title: "Oven-Fresh Taste",
        description:
          "Every pizza is baked fresh with professional techniques for perfect texture and flavor.",
        icon: Flame,
        color: "orange",
      },
      {
        title: "Made With Love",
        description:
          "Every ingredient is carefully selected to deliver a heart-warming experience.",
        icon: Heart,
        color: "pink",
      },
    ],
    []
  );

  // بيانات الفريق
  const teamMembers = useMemo(
    () => [
      {
        name: "Chef Marco",
        role: "Head Pizza Chef",
        image: Chef1Image,
        experience: "15+ years",
        specialty: "Traditional Italian Pizza",
        quote: "A great pizza starts with passion and the finest ingredients.",
      },
      {
        name: "Anna Smith",
        role: "Creative Recipe Designer",
        image: Chef2Image,
        experience: "10+ years",
        specialty: "Innovative Flavors",
        quote: "Creativity in the kitchen brings joy to every bite.",
      },
      {
        name: "Franco Pepe",
        role: "Quality Manager",
        image: Chef3Image,
        experience: "12+ years",
        specialty: "Quality Assurance",
        quote: "Perfecting every detail to deliver excellence.",
      },
    ],
    []
  );

  // بيانات الإحصائيات
  const stats = useMemo(
    () => [
      { label: "Happy Customers", value: "10K+", icon: Users },
      { label: "Pizzas Served", value: "50K+", icon: PizzaIcon },
      { label: "Years Experience", value: "25+", icon: Clock },
      { label: "Awards Won", value: "15+", icon: Star },
    ],
    []
  );

  // بيانات المزايا
  const features = useMemo(
    () => [
      {
        title: "Fresh Daily Dough",
        description:
          "Our dough is prepared fresh every morning for perfect texture.",
        icon: ChefHat,
      },
      {
        title: "100% Natural Cheese",
        description:
          "We use only premium, natural cheeses for authentic flavor.",
        icon: Award,
      },
      {
        title: "Quality Guarantee",
        description: "If you're not satisfied, we'll make it right.",
        icon: Shield,
      },
      {
        title: "Fast Delivery",
        description: "Hot pizza delivered in 30 minutes or less.",
        icon: Truck,
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-neutral-900 to-[#121212]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar active={"About Us"} />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center w-full pt-10 pb-20 text-center bg-yellow-500 md:pb-60 px-9 md:pt-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-[url('/pizza.png')] bg-cover bg-center opacity-10" />

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/pizza-pattern.png')] bg-size-[300px]" />
        </div>

        {/* Floating Pizza Icons */}
        {/* <div className="absolute top-10 left-10 animate-float-slow">
          <PizzaIcon className="w-16 h-16 text-white/50" />
        </div>
        <div className="absolute top-20 right-50 animate-float">
          <PizzaIcon className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div>
        <div className="absolute bottom-50 right-20 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-5 right-7 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div>

        <div className="absolute top-10 right-30 animate-float">
          <Dessert className="w-12 h-12 text-white" />
        </div> */}

        {/* Content */}
        <div className="relative z-20 max-w-4xl">
          <h1 className="mb-6 text-5xl font-[#121212] text-gray-900 md:text-7xl font-bold animate-fade-in-up">
            Our <span className="text-red-600">Story</span>
          </h1>

          <div className="inline-block px-1 py-1 mb-8">
            <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <p className="text-lg font-medium md:text-xl text-white/90">
                Since 1995 • Family Owned • Authentic Taste
              </p>
            </div>
          </div>

          <p className="max-w-3xl mx-auto text-xl font-light leading-relaxed md:text-2xl text-gray-900/90 animate-fade-in-up-delay">
            Welcome to{" "}
            <span className="font-bold text-red-600">Pizza House</span> —
            where passion meets flavor! We craft fresh, delicious pizza with the
            finest ingredients to bring you the perfect dining experience every
            time.
          </p>

          {/* Stats Bar */}
          <div className="grid max-w-4xl grid-cols-2 gap-6 mx-auto mt-12 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="p-4 text-center border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-900/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute left-0 right-0 z-10 -bottom-2">
          <Wave />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="px-4 py-20 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Text Content */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-yellow-400 rounded-full bg-yellow-500/10">
                  Our Journey
                </span>
                <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                  From Small Kitchen to{" "}
                  <span className="text-yellow-400">Community Favorite</span>
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-300">
                  What started as a small family-run pizzeria in 1995 has grown
                  into a beloved community institution. Our founder, Giovanni,
                  brought authentic Italian recipes from Naples and combined
                  them with local ingredients to create something truly special.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  Today, we continue his legacy by maintaining the same
                  commitment to quality, authenticity, and community that made
                  us successful from day one. Every pizza tells a story of
                  tradition, passion, and dedication to excellence.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="p-4 border 0 rounded-xl ">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <feature.icon className="w-5 h-5 text-yellow-400" />
                      </div>
                      <h4 className="font-semibold text-white">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image with Decorative Elements */}
            <div className="relative">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={PizzaImage}
                  alt="Our Signature Pizza"
                  fill
                  className="object-contain lg:object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#121212]/60 via-transparent to-transparent" />

                {/* Floating Badge */}
                <div className="absolute px-4 py-2 font-bold text-white bg-red-600 rounded-full shadow-lg top-6 right-6 animate-pulse">
                  #1 in Town
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute w-32 h-32 rounded-full -bottom-6 -left-6 bg-yellow-500/20 blur-3xl" />
              <div className="absolute w-32 h-32 rounded-full -top-6 -right-6 bg-red-500/20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="px-4 py-20 md:px-8 bg-[#121212]/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-yellow-400 rounded-full bg-yellow-500/10">
              What Drives Us
            </span>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Our <span className="text-yellow-400">Core Values</span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-400">
              These principles guide everything we do, from sourcing ingredients
              to serving our customers.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative  backdrop-blur-sm rounded-2xl p-8 border border-neutral-700/50 hover:border-yellow-500/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                onMouseEnter={() => setActiveValue(index)}
                onClick={() => setActiveValue(index)}
              >
                {/* Background Glow Effect */}
                {activeValue === index && (
                  <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 to-red-500/5 rounded-2xl" />
                )}

                <div className="relative z-10">
                  <div
                    className={`inline-flex p-4 rounded-2xl mb-6 ${
                      value.color === "yellow"
                        ? "bg-yellow-500/20"
                        : value.color === "red"
                        ? "bg-red-500/20"
                        : value.color === "blue"
                        ? "bg-blue-500/20"
                        : value.color === "green"
                        ? "bg-green-500/20"
                        : value.color === "orange"
                        ? "bg-yellow-500 opacity-90/20"
                        : "bg-pink-500/20"
                    }`}
                  >
                    <value.icon
                      className={`w-8 h-8 ${
                        value.color === "yellow"
                          ? "text-yellow-400"
                          : value.color === "red"
                          ? "text-red-400"
                          : value.color === "blue"
                          ? "text-blue-400"
                          : value.color === "green"
                          ? "text-green-400"
                          : value.color === "orange"
                          ? "text-orange-400"
                          : "text-pink-400"
                      }`}
                    />
                  </div>

                  <h3 className="mb-4 text-2xl font-bold text-white">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    {value.description}
                  </p>

                  {/* Animated Border */}
                  <div className="absolute bottom-0 h-1 transition-opacity duration-500 opacity-0 left-8 right-8 bg-linear-to-r from-transparent via-yellow-500 to-transparent group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="px-4 py-20 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-yellow-400 rounded-full bg-yellow-500/10">
              Meet the Experts
            </span>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              The <span className="text-yellow-400">Masterminds</span> Behind
              Your Pizza
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-400">
              Our talented team of chefs and specialists work tirelessly to
              create the perfect pizza experience for you.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative bg-neutral-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-neutral-700/50 hover:border-yellow-500 transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Member Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent to-[#121212]/80" />
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Experience Badge */}
                  <div className="absolute z-20 px-3 py-1 text-sm font-bold text-[#121212] bg-yellow-500 rounded-full top-4 right-4">
                    {member.experience}
                  </div>
                </div>

                {/* Member Info */}
                <div className="relative z-20 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="font-medium text-yellow-400">
                        {member.role}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-500/10">
                      <ChefHat className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm text-gray-300 rounded-full bg-neutral-700/50">
                      {member.specialty}
                    </span>
                  </div>

                  <p className="relative pl-6 italic text-gray-400 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-yellow-500 before:rounded-full">
                    &quot;{member.quote}&quot;
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 transition-all duration-500 pointer-events-none bg-linear-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-hover:via-yellow-500/5 group-hover:to-yellow-500/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 py-20 md:px-8 bg-linear-to-b from-[#121212]/50 to-neutral-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Visual Showcase */}
            <div className="grid grid-cols-2 gap-6">
              {[OvenImage, DeliveryImage, LoveImage, PizzaImage].map(
                (img, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden shadow-2xl rounded-2xl group"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={img}
                        alt="Why choose us"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#121212]/70 via-transparent to-transparent" />
                    </div>

                    {/* Overlay Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="text-xl font-bold">
                        {index === 0 && "Fresh Baked"}
                        {index === 1 && "Fast Delivery"}
                        {index === 2 && "Made with Love"}
                        {index === 3 && "Premium Quality"}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Reasons Content */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-yellow-400 rounded-full bg-yellow-500/10">
                  Why We Stand Out
                </span>
                <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                  Experience the{" "}
                  <span className="text-yellow-400">Pizza House</span>{" "}
                  Difference
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  "Authentic Italian recipes passed down through generations",
                  "Locally sourced, fresh ingredients daily",
                  "Wood-fired ovens for perfect crust every time",
                  "Fast, reliable delivery that keeps your pizza hot",
                  "Customizable options for every taste and preference",
                  "Eco-friendly packaging and sustainable practices",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex items-center justify-center w-8 h-8 mt-1 transition-transform rounded-full shrink-0 bg-yellow-500/20 group-hover:scale-110">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    </div>
                    <p className="text-lg text-gray-300 transition-colors group-hover:text-white">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-neutral-700/50">
                <p className="text-2xl italic font-bold text-yellow-400">
                  &quot;Taste the passion in every slice&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 border bg-linear-to-br from-yellow-500/10 via-red-500/10 to-yellow-500/10 rounded-3xl border-yellow-500/20">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Taste <span className="text-yellow-400">Perfection</span>
              ?
            </h2>
            <p className="max-w-2xl mx-auto mb-10 text-xl text-gray-300">
              Join thousands of satisfied customers who have made Pizza House
              their go-to for delicious, authentic pizza.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="px-8 py-4 font-bold text-[#121212] transition-all duration-300 shadow-lg bg-linear-to-r from-yellow-500 to-yellow-600 rounded-xl hover:from-yellow-600 hover:to-yellow-700 hover:scale-105 active:scale-95">
                Order Now
              </button>
              <button className="px-8 py-4 font-bold text-yellow-400 transition-all duration-300 bg-transparent border-2 border-yellow-500 rounded-xl hover:bg-yellow-500/10 hover:scale-105 active:scale-95">
                View Our Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in-up-delay {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
