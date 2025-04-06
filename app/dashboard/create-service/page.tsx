"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Circle,
  X,
} from "lucide-react";
import clsx from "clsx";
import {
  serviceOverviewSchema,
  ServiceOverviewSchema,
} from "@/validation-schemas/create-service-form-schemas";
import { Button } from "@/components/ui/button";

const steps = [
  { label: "Service Overview" },
  { label: "Service Description & Pricing Details" },
  { label: "Photos & Other Details" },
  { label: "Publish" },
];

export const eventServiceCategories = [
  {
    value: "event_planning_coordination",
    label: "Event Planning & Coordination",
    subcategories: [
      {
        value: "full_service_event_planners",
        label: "Full-Service Event Planners",
      },
      {
        value: "wedding_social_event_coordinators",
        label: "Wedding & Social EventCoordinators",
      },
      {
        value: "corporate_conference_organizers",
        label: "Corporate & Conference Organizers",
      },
    ],
  },
  {
    value: "venue_location",
    label: "Venue & Location",
    subcategories: [
      { value: "event_venues_halls", label: "Event Venues & Halls" },
      {
        value: "outdoor_unique_locations",
        label: "Outdoor & Unique Locations",
      },
      {
        value: "venue_management_services",
        label: "Venue Management Services",
      },
    ],
  },
  {
    value: "catering_food_services",
    label: "Catering & Food Services",
    subcategories: [
      { value: "bakery_cake_makers", label: "Bakery & Cake Makers" },
      {
        value: "caterers_gourmet_food_providers",
        label: "Caterers & Gourmet Food Providers",
      },
      { value: "food_trucks_popups", label: "Food Trucks & Pop-Up Kitchens" },
      {
        value: "dessert_beverage_services",
        label: "Dessert & Beverage Services",
      },
    ],
  },
  {
    value: "decoration_floral",
    label: "Decoration & Floral",
    subcategories: [
      {
        value: "event_decorators_stylists",
        label: "Event Decorators & Stylists",
      },
      {
        value: "florists_greenery_specialists",
        label: "Florists & Greenery Specialists",
      },
      { value: "set_theme_designers", label: "Set & Theme Designers" },
    ],
  },
  {
    value: "entertainment_performers",
    label: "Entertainment & Performers",
    subcategories: [
      { value: "musicians_djs_bands", label: "Musicians, DJs & Bands" },
      {
        value: "comedians_magicians_live_acts",
        label: "Comedians, Magicians & Live Acts",
      },
      {
        value: "dance_performance_groups",
        label: "Dance & Performance Groups",
      },
    ],
  },
  {
    value: "photography_videography",
    label: "Photography & Videography",
    subcategories: [
      {
        value: "professional_photography",
        label: "Professional Photography",
      },
      {
        value: "videography_film_makers",
        label: "Videography & Film Making",
      },
      {
        value: "photo_booth_print_services",
        label: "Photo Booth & Instant Print Services",
      },
    ],
  },
  {
    value: "audio_visual_technology",
    label: "Audio-Visual & Event Technology",
    subcategories: [
      {
        value: "av_lighting_specialists",
        label: "AV Production & Lighting Specialists",
      },
      {
        value: "sound_projection_services",
        label: "Sound & Projection Services",
      },
      { value: "event_apps_automation", label: "Event Apps & Tech Automation" },
      {
        value: "hybrid_virtual_streaming",
        label: "Hybrid & Virtual Event Streaming",
      },
    ],
  },
  {
    value: "transportation_logistics",
    label: "Transportation & Logistics",
    subcategories: [
      { value: "car_rentals", label: "Transportation Services & Car Rentals" },
      {
        value: "shuttle_limousine_providers",
        label: "Shuttle & Limousine Providers",
      },
      {
        value: "logistics_onsite_coordination",
        label: "Logistics & On-Site Coordination",
      },
    ],
  },
  {
    value: "event_rentals_equipment",
    label: "Event Rentals & Equipment",
    subcategories: [
      { value: "furniture_tents_linens", label: "Furniture, Tents & Linens" },
      {
        value: "staging_audio_equipment",
        label: "Staging & Audio Equipment Rentals",
      },
      {
        value: "party_reception_essentials",
        label: "Party & Reception Essentials",
      },
    ],
  },
  {
    value: "beauty_grooming_wellness",
    label: "Beauty, Grooming & Wellness",
    subcategories: [
      {
        value: "makeup_hair_stylists",
        label: "Makeup Artists & Hair Stylists",
      },
      {
        value: "event_grooming_services",
        label: "Grooming Services for Events",
      },
      { value: "spa_wellness_treatments", label: "Spa & Wellness Treatments" },
    ],
  },
  {
    value: "invitations_stationery",
    label: "Invitations & Stationery",
    subcategories: [
      {
        value: "custom_invitation_designers",
        label: "Custom Invitation Designers",
      },
      {
        value: "graphic_designers",
        label: "Graphic Designers",
      },
      {
        value: "digital_rsvp_management",
        label: "Digital Invites & RSVP Management",
      },
      {
        value: "stationery_print_packaging",
        label: "Stationery Printing & Packaging",
      },
    ],
  },
  {
    value: "branding_marketing",
    label: "Branding & Marketing",
    subcategories: [
      { value: "event_branding_signage", label: "Event Branding & Signage" },
      {
        value: "digital_print_specialists",
        label: "Digital & Print Media Specialists",
      },
      {
        value: "influencer_brand_partnerships",
        label: "Influencer & Brand Partnerships",
      },
      {
        value: "social_media_digital_campaigns",
        label: "Social Media & Digital Campaigns",
      },
      {
        value: "public_relations_press_coverage",
        label: "Public Relations & Press Coverage",
      },
    ],
  },
  {
    value: "security_crowd_management",
    label: "Security & Crowd Management",
    subcategories: [
      {
        value: "professional_security",
        label: "Professional Security Personnel",
      },
      {
        value: "crowd_traffic_control",
        label: "Event Crowd & Traffic Management",
      },
      {
        value: "safety_emergency_services",
        label: "Safety & Emergency Services",
      },
    ],
  },
  {
    value: "kids_family_events",
    label: "Kids' Parties & Family Events",
    subcategories: [
      { value: "birthday_party_planners", label: "Birthday Party Planners" },
      {
        value: "themed_kids_entertainment",
        label: "Themed Kids' Entertainment",
      },
      {
        value: "family_catering_decor",
        label: "Family-Friendly Catering & Decorate",
      },
    ],
  },
  {
    value: "cultural_themed_celebrations",
    label: "Cultural & Themed Celebrations",
    subcategories: [
      {
        value: "traditional_event_planners",
        label: "Traditional & Religious Event Planners",
      },
      { value: "themed_party_specialists", label: "Themed Party Specialists" },
      {
        value: "heritage_performances",
        label: "Heritage & Cultural Performances",
      },
    ],
  },
  {
    value: "corporate_merchandising",
    label: "Corporate Branding & Merchandising",
    subcategories: [
      { value: "branded_merchandise", label: "Branded Event Merchandise" },
      { value: "custom_gifts_giveaways", label: "Custom Gifts & Giveaways" },
      { value: "corporate_swag", label: "Corporate Swag & Promotional Items" },
    ],
  },
  {
    value: "eco_sustainable_events",
    label: "Eco-Friendly & Sustainable Events",
    subcategories: [
      {
        value: "sustainable_decor_rentals",
        label: "Sustainable Decorate & Rentals",
      },
      { value: "zero_waste_catering", label: "Zero-Waste Catering Solutions" },
      {
        value: "green_energy_services",
        label: "Green Energy & Carbon Offsetting Services",
      },
    ],
  },
  {
    value: "support_services",
    label: "Additional Support Services",
    subcategories: [
      {
        value: "event_insurance_legal",
        label: "Event Insurance & Legal Services",
      },
      { value: "onsite_staffing_support", label: "On-Site Staffing & Support" },
      {
        value: "event_consulting_accessibility",
        label: "Event Consulting & Accessibility Services",
      },
    ],
  },
];

export default function CreateServicePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [subcategories, setSubcategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [input, setInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceOverviewSchema>({
    resolver: zodResolver(serviceOverviewSchema),
    defaultValues: {
      s_tags: [],
      basePriceFeatures: ["", "", "", ""],
    },
  });

  const selectedCategory = watch("s_category");

  useEffect(() => {
    const matched = eventServiceCategories.find(
      (cat) => cat.value === selectedCategory
    );
    setSubcategories(matched ? matched.subcategories : []);
  }, [selectedCategory]);

  const onSubmit = (data: ServiceOverviewSchema) => {
    console.log("Form submitted", data);
    setCurrentStep(1);
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      {Object.keys(errors).length > 0 && (
        <div className="px-10 py-2 bg-red-200 text-red-500 flex items-center gap-2 text-center justify-center">
          <AlertCircle />
          <span>Please fill all the required fields!</span>
        </div>
      )}
      <nav className="w-full bg-white py-4 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.label} className="flex items-center space-x-2">
                <div
                  className={clsx(
                    "flex items-center space-x-2 text-sm font-medium",
                    isActive
                      ? "text-black"
                      : isCompleted
                      ? "text-primary"
                      : "text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Circle
                      className={clsx("w-4 h-4", isActive && "text-black")}
                    />
                  )}
                  <span>{step.label}</span>
                </div>

                {index < steps.length - 1 && (
                  <span className="text-sm">
                    <ChevronRight
                      className={clsx(
                        "w-4 h-4",
                        isCompleted
                          ? "text-primary"
                          : isActive
                          ? "text-black"
                          : "text-gray-400"
                      )}
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Form Content step 01 */}
      <div className="max-w-5xl px-4 py-6 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            <div className="flex-col flex box px-15 py-10 gap-5">
              <div className=" flex gap-13">
                <label htmlFor="service-title"> Service Title*</label>
                <input
                  type="text"
                  {...register("s_title")}
                  aria-invalid={!!errors.s_title}
                  placeholder="E.g. Elegant Custom Cakes for Every Occasion | Made to Wow"
                  className=" p-2 border border-black rounded-sm w-[512px] "
                />
                {errors.s_title && (
                  <p className="error-msg">{errors.s_title.message}</p>
                )}
              </div>

              <div className=" flex gap-4">
                <label htmlFor="service-category">Service Category*</label>
                <div className="flex gap-2">
                  <select
                    {...register("s_category")}
                    aria-invalid={!!errors.s_category}
                    className="w-full border p-2 rounded-sm"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select your service category
                    </option>
                    {eventServiceCategories.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.s_category && (
                    <p className="error-msg">{errors.s_category.message}</p>
                  )}

                  <select
                    {...register("s_subcategory")}
                    aria-invalid={!!errors.s_subcategory}
                    className="w-full border p-2 rounded-sm"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select your subcategory
                    </option>
                    {subcategories.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.s_subcategory && (
                    <p className="error-msg">{errors.s_subcategory.message}</p>
                  )}
                </div>
              </div>

              <div className="flex  gap-6.5 ">
                <label>Search Tags*</label>

                <div className="flex flex-wrap gap-2 ">
                  {(watch("s_tags") || []).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-primary rounded-xl text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(watch("s_tags") || [])];
                          updated.splice(index, 1);
                          setValue("s_tags", updated);
                        }}
                        className="text-gray-600 hover:text-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const cleaned = input.trim().toLowerCase();
                      const currentTags = watch("s_tags") || [];
                      if (
                        cleaned &&
                        /^[a-zA-Z0-9]+$/.test(cleaned) &&
                        !currentTags.includes(cleaned) &&
                        currentTags.length < 6
                      ) {
                        setValue("s_tags", [...currentTags, cleaned]);
                        setInput("");
                      }
                    }
                  }}
                  placeholder="Type and press Enter..."
                  className="border border-gray-300 rounded p-2 w-50"
                />

                <p className="text-xs text-gray-600 mt-3">
                  {watch("s_tags")?.length || 0}/6 tags maximum. Use letters and
                  numbers only.
                </p>

                {errors.s_tags && (
                  <p className="error-msg">{errors.s_tags.message as string}</p>
                )}
              </div>

              <div className="flex gap-3 items-center justify-center py-10 px-4">
                <Button onClick={() => setCurrentStep(1)}>Next</Button>
              </div>
            </div>
          )}

          {/* Form Content step 02 */}
          {currentStep === 1 && (
            <div className="flex-col flex box px-15 py-10 gap-5">
              <div className=" flex gap-15">
                <label htmlFor="service-description">
                  Service Description*
                </label>
                <textarea
                  {...register("fullDescription")}
                  aria-invalid={!!errors.fullDescription}
                  placeholder="Enter a full description about the vendor and what he does..."
                  className=" h-30 p-2 border border-black rounded-sm w-[512px] "
                ></textarea>
                {errors.fullDescription && (
                  <p className="error-msg">{errors.fullDescription.message}</p>
                )}
              </div>

              <div className=" flex gap-15">
                <label htmlFor="base-price">Starting Price (LKR)*</label>
                <input
                  type="number"
                  {...register("basePrice", { valueAsNumber: true })}
                  aria-invalid={!!errors.basePrice}
                  placeholder="E.g. 5000.00"
                  className="w-[300px] border rounded p-2"
                />
                {errors.basePrice && (
                  <p className="error-msg">{errors.basePrice.message}</p>
                )}
              </div>

              <div className="flex gap-9">
                <label htmlFor="base-price-features">
                  Starting Price Features*
                </label>
                <div className="flex flex-col gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex flex-col">
                      <input
                        type="text"
                        placeholder={`Feature ${index + 1}${
                          index < 2 ? " (required)" : " (optional)"
                        }`}
                        {...register(`basePriceFeatures.${index}` as const)}
                        className="border rounded-sm p-2 w-[512px]"
                      />
                      {errors.basePriceFeatures &&
                        Array.isArray(errors.basePriceFeatures) &&
                        errors.basePriceFeatures[index] && (
                          <p className="error-msg">
                            {errors.basePriceFeatures[index]?.message}
                          </p>
                        )}
                    </div>
                  ))}
                  {errors.basePriceFeatures &&
                    !Array.isArray(errors.basePriceFeatures) &&
                    typeof errors.basePriceFeatures.message === "string" && (
                      <p className="error-msg">
                        {errors.basePriceFeatures.message}
                      </p>
                    )}
                </div>
              </div>

              <div className=" flex gap-24">
                <label htmlFor="cancellation-refund-policy">
                  Cancellation & <br /> Refund Policy*
                </label>
                <input
                  type="text"
                  {...register("cancellationPolicy")}
                  aria-invalid={!!errors.cancellationPolicy}
                  placeholder="Type here..."
                  className=" p-2 border border-black rounded-sm w-[512px] "
                />
                {errors.cancellationPolicy && (
                  <p className="error-msg">
                    {errors.cancellationPolicy.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 items-center justify-center py-10 px-4">
                <Button onClick={() => setCurrentStep(0)}>Back</Button>
                <Button onClick={() => setCurrentStep(2)}>Next</Button>
              </div>
            </div>
          )}

          {/* Form Content step 03 */}
          {currentStep === 2 && (
            <div className="flex-col flex box px-15 py-10 gap-5">
              <div className=" flex gap-15">
                <label htmlFor="photo-gallery">Photo Gallery*</label>
                <input
                  type="text"
                  {...register("cancellationPolicy")}
                  aria-invalid={!!errors.cancellationPolicy}
                  placeholder="Type here..."
                  className=" p-2 border border-black rounded-sm w-[512px] "
                />
                {errors.cancellationPolicy && (
                  <p className="error-msg">
                    {errors.cancellationPolicy.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button className="btn" onClick={() => setCurrentStep(1)}>
                  Back
                </button>
                <button className="btn" onClick={() => setCurrentStep(3)}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Form Content step 04 */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Step 4: Publish</h2>
              {/* Your fields here */}
              <div className="flex gap-2">
                <button className="btn" onClick={() => setCurrentStep(2)}>
                  Back
                </button>
                <button className="btn" type="submit">
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
