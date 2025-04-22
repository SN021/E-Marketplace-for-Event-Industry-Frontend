"use client";

import React, { useEffect, useState } from "react";
import { locationOptions } from "@/data/locations";
import { ratingOptions } from "@/data/ratings";
import { experienceOptions } from "@/data/experience";
import { Button } from "@/components/ui/button";

type SidebarFiltersProps = {
  onApply: (filters: any) => void;
};

const ServiceFilters = ({ onApply }: SidebarFiltersProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);



  const handleApply = () => {
    onApply({
      rating: selectedRating,
      minPrice: minPrice ?? null,
      maxPrice: maxPrice ?? null,
      experience,
      location,
    });
  };

  const handleReset = () => {
    setSelectedRating(null);
    setMinPrice(null);
    setMaxPrice(null);
    setExperience(null);
    setLocation(null);
    onApply({});
  };

  return (
    <div className="w-full p-4 bg-white border rounded-lg shadow-md space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Ratings</h3>
        {ratingOptions.map((star) => (
          <label key={star.value} className="block">
            <input
              type="checkbox"
              checked={selectedRating === star.value}
              onChange={() => setSelectedRating(star.value)}
            />
            <span className="ml-2">{star.label}</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Pricing Range (LKR)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice ?? ""}
            onChange={(e) =>
              setMinPrice(e.target.value ? parseInt(e.target.value) : null)
            }
            className="w-full p-2 border rounded"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Experience</h3>
        {experienceOptions.map((exp) => (
          <label key={exp.value} className="block">
            <input
              type="checkbox"
              checked={experience === exp.value}
              onChange={() => setExperience(exp.value)}
            />
            <span className="ml-2">{exp.label}</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Location</h3>
        <select
          value={location ?? ""}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2  rounded"
        >
          <option value="">Select a location</option>
          {locationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={handleApply} className="w-1/2">
          Apply Filters
        </Button>
        <Button onClick={handleReset} className="w-1/2">
          Reset
        </Button>
      </div>
    </div>
  );
};
export default ServiceFilters;
