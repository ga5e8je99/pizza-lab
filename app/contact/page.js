"use client";
import { useState, useEffect, useRef } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Wave from "../Components/Wave";
import Loading from "../Components/Loading";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

export default function Contact() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: ""
  });
  const formRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: "" });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically send the data to your backend
      console.log("Form submitted:", formData);
      
      setFormStatus({ submitting: false, success: true, error: "" });
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        setFormStatus({ submitting: false, success: false, error: "" });
      }, 3000);
      
    } catch (error) {
      setFormStatus({ 
        submitting: false, 
        success: false, 
        error: "Failed to send message. Please try again." 
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      details: ["123 Pizza Street", "Cairo, Egypt 12345"],
      color: "text-red-400",
      bgColor: "bg-red-400/10"
    },
    {
      icon: Phone,
      title: "Phone Number",
      details: ["+20 111 222 3333", "+20 444 555 6666"],
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["support@pizzahouse.com", "orders@pizzahouse.com"],
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon-Sun: 10:00 AM - 12:00 AM", "Delivery: 24/7"],
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", color: "hover:bg-blue-600", href: "#" },
    { icon: Instagram, label: "Instagram", color: "hover:bg-pink-600", href: "#" },
    { icon: Twitter, label: "Twitter", color: "hover:bg-sky-500", href: "#" },
    { icon: MessageCircle, label: "WhatsApp", color: "hover:bg-green-500", href: "#" }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        
          <Loading />
          
        
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Navbar active={"Contact"} />
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex flex-col items-center justify-center  overflow-hidden pt-10 pb-20 text-center md:pb-90 px-9 md:pt-60 bg-yellow-500">
        {/* Background Gradient */}
       
        <div className="absolute inset-0 bg-[url('/pizza.png')] bg-cover bg-center opacity-10" />
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/pizza-pattern.png')] bg-repeat bg-size-[300px]" />
        </div>
        
        
        
        {/* Content */}
        <div className="relative z-20 max-w-4xl">
          <h1 className="mb-6 text-5xl font-black text-gray-900 md:text-7xl animate-fade-in-up">
            Get in <span className="text-red-600">Touch</span>
          </h1>
          
          <div className="inline-block px-1 py-1 mb-8">
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm">
              <p className="text-lg font-medium md:text-xl text-white/90">
                We &apos;  re here to help! Reach out anytime.
              </p>
            </div>
          </div>
          
          <p className="max-w-3xl mx-auto text-xl font-light leading-relaxed md:text-2xl text-gray-900/90 animate-fade-in-up-delay">
            Have questions, feedback, or special requests? Our team is ready to 
            assist you with anything you need. Your satisfaction is our priority.
          </p>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute left-0 right-0 z-10 -bottom-5">
          <Wave />
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="sticky space-y-8 top-24">
                {/* Info Cards */}
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div 
                      key={index}
                      className="group bg-neutral-800/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700/50 hover:border-yellow-500/50 transition-all duration-500 hover:scale-[1.02]"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${item.bgColor}`}>
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-2 text-lg font-bold text-white">
                            {item.title}
                          </h3>
                          {item.details.map((detail, idx) => (
                            <p key={idx} className="mb-1 text-sm text-gray-400 last:mb-0">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media Links */}
                <div className="p-6 border bg-neutral-800/30 backdrop-blur-sm rounded-2xl border-neutral-700/50">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <Link
                        key={index}
                        href={social.href}
                        className={`flex-1 p-3 rounded-xl bg-neutral-700/50 ${social.color} transition-all duration-300 group flex flex-col items-center justify-center`}
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <span className="mt-1 text-xs text-gray-400 group-hover:text-white">
                          {social.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* FAQ/Quick Help */}
                <div className="p-6 border bg-linear-to-br from-yellow-500/10 to-red-500/10 rounded-2xl border-yellow-500/20">
                  <h3 className="mb-3 text-xl font-bold text-yellow-400">
                    Quick Help
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-300">
                      • Orders: Usually answered within 30 minutes
                    </li>
                    <li className="text-gray-300">
                      • Delivery: Track your order in real-time
                    </li>
                    <li className="text-gray-300">
                      • Feedback: We value your suggestions
                    </li>
                    <li className="text-gray-300">
                      • Emergency: Call +20 111 222 3333
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form & Map */}
            <div className="space-y-8 lg:col-span-2">
              {/* Contact Form */}
              <div className="p-8 border shadow-2xl bg-neutral-800/30 backdrop-blur-sm rounded-3xl border-neutral-700/50">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                      Send us a Message
                    </h2>
                    <p className="text-gray-400">
                      Fill out the form below and we &apos;  ll get back to you within 24 hours.
                    </p>
                  </div>
                  <div className="hidden p-4 rounded-full md:block bg-yellow-500/20">
                    <Send className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>

                {/* Status Messages */}
                {formStatus.success && (
                  <div className="flex items-center gap-3 p-4 mb-6 border bg-green-500/10 border-green-500/30 rounded-xl animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium text-green-400">
                        Message sent successfully!
                      </p>
                      <p className="text-sm text-green-300">
                        We &apos;  ll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                {formStatus.error && (
                  <div className="flex items-center gap-3 p-4 mb-6 border bg-red-500/10 border-red-500/30 rounded-xl animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="font-medium text-red-400">
                        {formStatus.error}
                      </p>
                    </div>
                  </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all border bg-neutral-700/50 border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all border bg-neutral-700/50 border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all border bg-neutral-700/50 border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="+20 123 456 7890"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all border bg-neutral-700/50 border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="">Select a subject</option>
                        <option value="order">Order Inquiry</option>
                        <option value="delivery">Delivery Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all border resize-none bg-neutral-700/50 border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-400">
                      * Required fields
                    </p>
                    <button
                      type="submit"
                      disabled={formStatus.submitting}
                      className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                        formStatus.submitting
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                      }`}
                    >
                      {formStatus.submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Map Section */}
              <div className="overflow-hidden border shadow-2xl bg-neutral-800/30 backdrop-blur-sm rounded-3xl border-neutral-700/50">
                <div className="p-6 border-b border-neutral-700/50">
                  <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                    <MapPin className="w-6 h-6 text-yellow-400" />
                    Find Our Restaurant
                  </h3>
                  <p className="mt-2 text-gray-400">
                    Visit us at our main location in Cairo
                  </p>
                </div>
                
                <div className="relative h-[400px]">
                  <iframe
                    className="w-full h-full"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.603895251!2d31.188423395103007!3d30.044419644366307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458470d57e6d457%3A0x5ef5f5e5c5e5c5e5!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1629990000000!5m2!1sen!2seg"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Pizza House Location"
                  />
                  
                  {/* Map Overlay Info */}
                  <div className="absolute max-w-xs p-4 bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl">
                    <h4 className="mb-1 font-bold text-white">Pizza House</h4>
                    <p className="text-sm text-gray-300">
                      123 Pizza Street, Cairo, Egypt
                    </p>
                    <p className="mt-2 text-sm text-yellow-400">
                      Free parking available
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Contact Methods */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-6 border bg-linear-to-br from-red-500/10 to-red-600/5 rounded-2xl border-red-500/20">
                  <h4 className="mb-3 text-lg font-bold text-white">
                    Emergency Contact
                  </h4>
                  <p className="mb-3 text-sm text-gray-400">
                    For urgent delivery issues or complaints
                  </p>
                  <a 
                    href="tel:+201112223333" 
                    className="inline-flex items-center gap-2 font-bold text-red-400 transition-colors hover:text-red-300"
                  >
                    <Phone className="w-5 h-5" />
                    +20 111 222 3333
                  </a>
                </div>

                <div className="p-6 border bg-linear-to-br from-yellow-500/10 to-yellow-600/5 rounded-2xl border-yellow-500/20">
                  <h4 className="mb-3 text-lg font-bold text-white">
                    Live Chat Support
                  </h4>
                  <p className="mb-3 text-sm text-gray-400">
                    Chat with our support team in real-time
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 font-bold text-black transition-colors rounded-lg bg-yellow-500 hover:bg-yellow-600">
                    <MessageCircle className="w-5 h-5" />
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ/Common Questions */}
      <section className="px-4 py-20 md:px-8 ">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-yellow-500 md:text-4xl">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                q: "What are your delivery hours?",
                a: "We deliver daily from 10:00 AM to 12:00 AM. Express delivery is available within 30 minutes during peak hours."
              },
              {
                q: "Do you offer gluten-free options?",
                a: "Yes! We have a variety of gluten-free crust options and can accommodate most dietary restrictions."
              },
              {
                q: "How can I track my order?",
                a: "Once your order is confirmed, you'll receive a tracking link via SMS and email with real-time updates."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept cash on delivery, credit/debit cards, and popular digital wallets like Vodafone Cash and Fawry."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="p-6 transition-colors border bg-neutral-800/30 backdrop-blur-sm rounded-2xl border-neutral-700/50 hover:border-yellow-500/30"
              >
                <h3 className="mb-3 text-lg font-bold text-white">
                  {faq.q}
                </h3>
                <p className="text-gray-400">
                  {faq.a}
                </p>
              </div>
            ))}
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
        
        @keyframes float-slow {
          0%, 100% {
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
        
        .animate-fade-in {
          animation: fadeInUp 0.5s ease-out;
        }
        
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}