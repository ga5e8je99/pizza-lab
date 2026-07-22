"use client";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Loading from "./Components/Loading";
import Hero from "./Components/Hero";
// import Offer from "./Components/Offer";
import Menu from "./Components/Menu";

export default function Home() {
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
 

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Loading />
      </div>
    );
  else {
    return (
      <div className="opacity-0 animate-fadeIn">
        <Navbar active={"Home"} />
        <Hero />
        {/* <Offer /> */}
        <Menu />
        <Footer />
      </div>
    );
  }
}
