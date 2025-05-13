"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { locationOptions } from "@/data/locations";
import { ratingOptions } from "@/data/ratings";
import { experienceOptions } from "@/data/experience";

type SidebarFiltersProps = {
  onApply: (filters: any) => void;
};

const ServiceFilters = ({ onApply }: SidebarFiltersProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [experience, setExperience] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [locationOpen, setLocationOpen] = useState(false);

  const handleExperienceChange = (value: string) => {
    setExperience((prev) =>
      prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value]
    );
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
    <aside className="w-full p-6 bg-white rounded-2xl border shadow-sm space-y-6">
      {/* Current Filters */}
      {(selectedRating || minPrice || maxPrice || experience.length || location.length) && (
        <div className="bg-slate-50 p-4 rounded-xl border text-sm">
          <h4 className="text-base font-semibold mb-2 text-gray-800">Current Filters</h4>
          <ul className="space-y-1 text-gray-600">
            {selectedRating && <li>⭐ Min Rating: {selectedRating}</li>}
            {(minPrice != null || maxPrice != null) && (
              <li>
                Price Range: {minPrice ?? "Any"} – {maxPrice ?? "Any"}
              </li>
            )}
            {experience.length > 0 && <li>Experience: {experience.join(", ")}</li>}
            {location.length > 0 && <li>Location: {location.join(", ")}</li>}
          </ul>
        </div>
      )}

      {/* Ratings */}
      <div>
        <h3 className="text-sm font-medium mb-2">Ratings</h3>
        <div className="space-y-2">
          {ratingOptions.map((star) => (
            <label key={star.value} className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === star.value}
                onChange={() => setSelectedRating(star.value)}
              />
              {star.label}
            </label>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-sm font-medium mb-2">Pricing Range (LKR)</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={minPrice ?? ""}
            onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : null)}
          />
          <Input
            placeholder="Max"
            type="number"
            value={maxPrice ?? ""}
            onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
      </div>

      {/* Experience */}
      <div>
        <h3 className="text-sm font-medium mb-2">Experience</h3>
        <div className="space-y-2">
          {experienceOptions.map((exp) => (
            <div key={exp.value} className="flex items-center gap-2">
              <Checkbox
                checked={experience.includes(exp.value)}
                onCheckedChange={() => handleExperienceChange(exp.value)}
              />
              <Label className="text-sm">{exp.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Location (Multi-select Dropdown) */}
      <div>
        <h3 className="text-sm font-medium mb-2">Location</h3>
        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
          <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start py-2 bg-white text-left whitespace-normal min-h-[2.5rem]"
          >
            {location.length ? location.join(", ") : "Select locations"}
          </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Search locations..." className="h-9" />
              <ScrollArea className="max-h-60">
                <CommandGroup>
                  {locationOptions.map((item) => (
                    <CommandItem
                      key={item.value}
                      onSelect={() =>
                        setLocation((prev) =>
                          prev.includes(item.value)
                            ? prev.filter((val) => val !== item.value)
                            : [...prev, item.value]
                        )
                      }
                      className="flex justify-between"
                    >
                      <span>{item.label}</span>
                      <Checkbox
                        checked={location.includes(item.value)}
                        onCheckedChange={() =>
                          setLocation((prev) =>
                            prev.includes(item.value)
                              ? prev.filter((val) => val !== item.value)
                              : [...prev, item.value]
                          )
                        }
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <Button onClick={handleApply} className="w-1/2">
          Apply
        </Button>
        <Button onClick={handleReset} variant="outline" className="w-1/2">
          Reset
        </Button>
      </div>
    </aside>
  );
};

export default ServiceFilters;
