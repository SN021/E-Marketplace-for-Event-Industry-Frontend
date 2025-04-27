"use client";

import React, { useState } from "react";
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
  const [experience, setExperience] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);


  const handleExperienceChange = (value: string) => {
    setExperience((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleLocationChange = (value: string) => {
    setLocation((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleRatingChange = (value: number) => {
    setSelectedRating(value);
  };

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
    setExperience([]);
    setLocation([]);
    onApply({});
  };

  return (
    <div className="w-full p-4 bg-white border rounded-lg shadow-md space-y-4">
      {/* Current Filters Display */}
      {(selectedRating ||
        minPrice ||
        maxPrice ||
        experience.length > 0 ||
        location.length > 0) && (
        <div className="p-4 mb-4 bg-gray-100 rounded-lg">
          <h4 className="text-md font-semibold mb-2">Current Filters:</h4>
          <ul className="text-sm space-y-1">
            {selectedRating && <li>⭐ Minimum Rating: {selectedRating}</li>}
            {(minPrice != null || maxPrice != null) && (
              <li>
                Price Range: {minPrice != null ? `LKR ${minPrice}` : "Any"} -{" "}
                {maxPrice != null ? `LKR ${maxPrice}` : "Any"}
              </li>
            )}
            {experience.length > 0 && (
              <li>Experience: {experience.join(", ")}</li>
            )}
            {location.length > 0 && <li>Location: {location.join(", ")}</li>}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button onClick={handleApply} className="w-1/2">
          Apply Filters
        </Button>
        <Button onClick={handleReset} className="w-1/2">
          Reset
        </Button>
      </div>

      {/* Ratings */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Ratings</h3>
        {ratingOptions.map((star) => (
          <label key={star.value} className="block">
            <input
              type="radio"
              name="rating"
              value={star.value}
              checked={selectedRating === star.value}
              onChange={() => handleRatingChange(star.value)}
            />
            <span className="ml-2">{star.label}</span>
          </label>
        ))}
      </div>

      {/* Pricing */}
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

      {/* Experience */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Experience</h3>
        {experienceOptions.map((exp) => (
          <label key={exp.value} className="block">
            <input
              type="checkbox"
              checked={experience.includes(exp.value)}
              onChange={() => handleExperienceChange(exp.value)}
            />
            <span className="ml-2">{exp.label}</span>
          </label>
        ))}
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Location</h3>
        {locationOptions.map((option) => (
          <label key={option.value} className="block">
            <input
              type="checkbox"
              checked={location.includes(option.value)}
              onChange={() => handleLocationChange(option.value)}
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ServiceFilters;
