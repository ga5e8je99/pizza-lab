"use client";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { MapPin, Phone, Clock, ChevronRight, Navigation } from "lucide-react";
import { useState } from "react";

export default function Order() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const restaurants = [
    {
      id: "1r",
      name: "New Cairo - Downtown",
      address: "1 Pizza House Street, New Cairo, Cairo",
      phone: "+20 100 123 4567",
      hours: "9:00 AM - 2:00 AM",
      delivery: true,
      pickup: true,
      rating: 4.5,
      map: "https://maps.google.com/?q=New+Cairo+Pizza+House",
    },
    {
      id: "2r",
      name: "Nasr City - City Center",
      address: "2 Pizza House Mall, Nasr City, Cairo",
      phone: "+20 100 987 6543",
      hours: "10:00 AM - 1:00 AM",
      delivery: true,
      pickup: true,
      rating: 4.7,
      map: "https://maps.google.com/?q=Nasr+City+Pizza+House",
    },
    {
      id: "3r",
      name: "Maadi - Corniche",
      address: "3 Pizza House, Corniche El Nil, Maadi",
      phone: "+20 100 555 8888",
      hours: "8:00 AM - 12:00 AM",
      delivery: true,
      pickup: true,
      rating: 4.8,
      map: "https://maps.google.com/?q=Maadi+Pizza+House",
    },
    {
      id: "4r",
      name: "Zamalek - 26th July",
      address: "4 Pizza House, 26th July Street, Zamalek",
      phone: "+20 100 222 3333",
      hours: "11:00 AM - 3:00 AM",
      delivery: true,
      pickup: true,
      rating: 4.6,
      map: "https://maps.google.com/?q=Zamalek+Pizza+House",
    },
    {
      id: "5r",
      name: "Heliopolis - Korba",
      address: "5 Pizza House, Korba Square, Heliopolis",
      phone: "+20 100 444 7777",
      hours: "9:30 AM - 1:30 AM",
      delivery: true,
      pickup: true,
      rating: 4.9,
      map: "https://maps.google.com/?q=Heliopolis+Pizza+House",
    },
    {
      id: "6r",
      name: "6th of October City",
      address: "6 Pizza House, Central District, 6th of October",
      phone: "+20 100 666 9999",
      hours: "10:00 AM - 2:00 AM",
      delivery: true,
      pickup: true,
      rating: 4.4,
      map: "https://maps.google.com/?q=6th+October+Pizza+House",
    },
    {
      id: "7r",
      name: "Alexandria - San Stefano",
      address: "7 Pizza House, San Stefano Mall, Alexandria",
      phone: "+20 100 111 2222",
      hours: "9:00 AM - 12:00 AM",
      delivery: true,
      pickup: true,
      rating: 4.7,
      map: "https://maps.google.com/?q=Alexandria+Pizza+House",
    },
    {
      id: "8r",
      name: "Giza - Pyramids Road",
      address: "8 Pizza House, Pyramids Road, Giza",
      phone: "+20 100 888 0000",
      hours: "8:00 AM - 1:00 AM",
      delivery: true,
      pickup: true,
      rating: 4.5,
      map: "https://maps.google.com/?q=Giza+Pizza+House",
    },
    {
      id: "9r",
      name: "Mohandessin - Gameat El Dewal",
      address: "9 Pizza House, Gameat El Dewal St., Mohandessin",
      phone: "+20 100 777 1111",
      hours: "10:00 AM - 2:00 AM",
      delivery: true,
      pickup: true,
      rating: 4.8,
      map: "https://maps.google.com/?q=Mohandessin+Pizza+House",
    },
    {
      id: "10r",
      name: "Sheikh Zayed - Arkan Plaza",
      address: "10 Pizza House, Arkan Plaza, Sheikh Zayed",
      phone: "+20 100 333 4444",
      hours: "9:00 AM - 1:00 AM",
      delivery: true,
      pickup: true,
      rating: 4.6,
      map: "https://maps.google.com/?q=Sheikh+Zayed+Pizza+House",
    },
  ];

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen">
        <div className="container px-4 py-12 mx-auto max-w-7xl">
          {/* رأس الصفحة */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold text-yellow-500">
              Find a Pizza House Near You
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-300">
              Choose from our locations across Egypt. Order online for delivery or pickup!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* قائمة المطاعم */}
            <div className="lg:col-span-2">
              <div className="p-6 mb-8 bg-yellow-500 border border-yellow-200 rounded-2xl">
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  Our Locations
                </h2>
                <p className="mb-6 text-gray-800">
                  Select a restaurant to view details and order options
                </p>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className={`p-6 transition-all duration-300 bg-white border rounded-2xl cursor-pointer hover:shadow-xl ${
                        selectedRestaurant?.id === restaurant.id
                          ? "border-yellow-500 ring-2 ring-yellow-500"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleSelectRestaurant(restaurant)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 rounded-full">
                          <span className="font-bold text-yellow-700">
                            ★ {restaurant.rating}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 mt-1 text-yellow-500 shrink-0" />
                          <p className="text-gray-600">{restaurant.address}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                          <p className="text-gray-600">{restaurant.phone}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-yellow-500 shrink-0" />
                          <p className="text-gray-600">{restaurant.hours}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-6">
                        <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                          Delivery
                        </span>
                        <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                          Pickup
                        </span>
                      </div>
                      
                      <button
                        className="flex items-center gap-2 mt-6 font-medium text-yellow-600 hover:text-yellow-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(restaurant.map, '_blank');
                        }}
                      >
                        <Navigation className="w-4 h-4" />
                        View on Map
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* مزايا إضافية */}
              <div className="p-6 bg-linear-to-r from-yellow-500 to-yellow-600 rounded-2xl">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Why Order From Pizza House?
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="p-4 bg-white rounded-xl">
                    <div className="inline-flex p-3 mb-4 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="mb-2 font-bold text-gray-900">Fast Delivery</h4>
                    <p className="text-gray-600">Average delivery time: 30-45 minutes</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-xl">
                    <div className="inline-flex p-3 mb-4 bg-yellow-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="mb-2 font-bold text-gray-900">10+ Locations</h4>
                    <p className="text-gray-600">Across major cities in Egypt</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-xl">
                    <div className="inline-flex p-3 mb-4 bg-yellow-100 rounded-lg">
                      <Phone className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="mb-2 font-bold text-gray-900">24/7 Support</h4>
                    <p className="text-gray-600">Customer service available around the clock</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* معلومات المطعم المحدد */}
            <div className="lg:col-span-1">
              <div className="sticky p-6 border border-yellow-500 rounded-2xl top-22">
                {selectedRestaurant ? (
                  <>
                    <h2 className="mb-6 text-2xl font-bold text-yellow-500">
                      {selectedRestaurant.name}
                    </h2>
                    
                    <div className="mb-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-1 text-yellow-500 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-300">Address</p>
                          <p className="text-gray-400">{selectedRestaurant.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-300">Phone</p>
                          <p className="text-gray-400">{selectedRestaurant.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-500 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-300">Working Hours</p>
                          <p className="text-gray-400">{selectedRestaurant.hours}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 text-sm font-bold text-yellow-700 bg-yellow-100 rounded-full">
                          ★ {selectedRestaurant.rating}/5
                        </div>
                        <p className="text-gray-400">Customer Rating</p>
                      </div>
                    </div>
                    
                   
                    
                    <div className="space-y-4">
                      <button
                        onClick={() => window.open(selectedRestaurant.map, '_blank')}
                        className="flex items-center justify-center w-full gap-2 px-6 py-3 font-bold text-white transition-colors bg-yellow-500 opacity-90 rounded-xl hover:bg-yellow-600"
                      >
                        <Navigation className="w-5 h-5" />
                        Open in Google Maps
                      </button>
                      
                      <button
                        onClick={() => window.location.href = `/menu?restaurant=${selectedRestaurant.id}`}
                        className="flex items-center justify-center w-full gap-2 px-6 py-3 font-bold text-gray-900 transition-colors bg-white border border-gray-300 rounded-xl hover:bg-gray-100"
                      >
                        Order from this location
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-gray-700">
                      <p className="text-sm text-gray-400">
                        💡 <span className="font-medium text-gray-300">Tip:</span> Orders placed before 10 PM will be delivered the same day.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <div className="inline-flex p-4 mb-6 bg-yellow-900 rounded-full">
                      <MapPin className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-300">
                      Select a Restaurant
                    </h3>
                    <p className="text-gray-400">
                      Click on any restaurant from the list to view details and order options
                    </p>
                  </div>
                )}
                {/* معلومات الاتصال العامة */}
              <div className="p-6 mt-6 bg-linear-to-r from-red-600 to-red-700 rounded-2xl">
                <h3 className="mb-4 text-xl font-bold text-white">
                  Need Help? Contact Us
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-white" />
                    <div>
                      <p className="text-sm text-gray-200">Customer Service</p>
                      <p className="font-bold text-white">19991</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-white" />
                    <div>
                      <p className="text-sm text-gray-200">Available</p>
                      <p className="font-bold text-white">24/7</p>
                    </div>
                  </div>
                  <p className="pt-4 mt-4 text-sm text-gray-200 border-t border-red-500">
                    For bulk orders or catering services, please call us directly.
                  </p>
                </div>
              </div>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}