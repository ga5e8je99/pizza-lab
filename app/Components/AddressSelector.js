"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";

export default function AddressForm({ onAddressChange, initialAddress = {} }) {
  const [addressData, setAddressData] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Search addresses using Nominatim (OpenStreetMap)
  const searchAddress = useCallback(async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5&accept-language=en`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchAddress(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchAddress]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle suggestion selection
  const selectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    const displayName = suggestion.display_name || "";
    const addr = suggestion.address || {};
    setAddress((prev) => ({
      ...prev,
      street: addr.road || addr.pedestrian || "",
      city: addr.city || addr.town || addr.village || "",
      district: addr.suburb || addr.neighbourhood || "",
      formattedAddress: displayName,
      latitude: lat,
      longitude: lon,
    }));
    setSearchQuery(displayName);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Handle manual input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Notify parent component of address changes
  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(address);
    }
  }, [address, onAddressChange]);

  return (
    <div className="space-y-6">
      {/* Address search field */}
      <div className="relative" ref={searchRef}>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Search for your address
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Search for street, area, city..."
          />
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSuggestions([]);
              }}
              className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => selectSuggestion(sug)}
                className="flex items-start w-full gap-2 px-4 py-2 text-left border-b border-gray-100 hover:bg-gray-50 last:border-0"
              >
                <MapPin className="w-4 h-4 mt-1 text-yellow-500 shrink-0" />
                <div className="text-sm text-gray-800">{sug.display_name}</div>
              </button>
            ))}
          </div>
        )}
        {isSearching && (
          <div className="absolute z-10 w-full p-2 mt-1 text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-lg">
            Searching...
          </div>
        )}
      </div>

      {/* Address details */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="Street name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">District</label>
          <input
            type="text"
            name="district"
            value={address.district}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="District / neighborhood"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Building No.</label>
          <input
            type="text"
            name="buildingNo"
            value={address.buildingNo}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="e.g., 15"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Floor</label>
          <input
            type="text"
            name="floor"
            value={address.floor}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="e.g., 3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Apartment</label>
          <input
            type="text"
            name="apartment"
            value={address.apartment}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            placeholder="Apartment number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Additional Details</label>
        <textarea
          name="additionalDetails"
          value={address.additionalDetails}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          placeholder="Extra instructions for delivery (e.g., near mosque, back entrance...)"
        />
      </div>

      {address.formattedAddress && (
        <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
          <p className="text-sm text-yellow-800">
            <strong>Selected address:</strong> {address.formattedAddress}
          </p>
        </div>
      )}
    </div>
  );
}