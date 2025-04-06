"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Circle,
  TriangleAlert,
  X,
} from "lucide-react";
import clsx from "clsx";
import {
  serviceOverviewSchema,
  ServiceOverviewSchema,
} from "@/validation-schemas/create-service-form-schemas";
import { Button } from "@/components/ui/button";
import Select from "react-select";

const steps = [
  { label: "Service Overview" },
  { label: "Service Description & Pricing Details" },
  { label: "Photos & Other Details" },
  { label: "Publish" },
];

const eventServiceCategories = [
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

const locationOptions = [
  { value: "islandwide", label: "Islandwide" },
  { value: "Colombo", label: "Colombo" },
  { value: "Gampaha", label: "Gampaha" },
  { value: "Kalutara", label: "Kalutara" },
  { value: "Kandy", label: "Kandy" },
  { value: "Matale", label: "Matale" },
  { value: "Nuwara Eliya", label: "Nuwara Eliya" },
  { value: "Galle", label: "Galle" },
  { value: "Matara", label: "Matara" },
  { value: "Hambantota", label: "Hambantota" },
  { value: "Jaffna", label: "Jaffna" },
  { value: "Mannar", label: "Mannar" },
  { value: "Vavuniya", label: "Vavuniya" },
  { value: "Mullaitivu", label: "Mullaitivu" },
  { value: "Kilinochchi", label: "Kilinochchi" },
  { value: "Batticaloa", label: "Batticaloa" },
  { value: "Ampara", label: "Ampara" },
  { value: "Trincomalee", label: "Trincomalee" },
  { value: "Kurunegala", label: "Kurunegala" },
  { value: "Puttalam", label: "Puttalam" },
  { value: "Anuradhapura", label: "Anuradhapura" },
  { value: "Polonnaruwa", label: "Polonnaruwa" },
  { value: "Badulla", label: "Badulla" },
  { value: "Monaragala", label: "Monaragala" },
  { value: "Ratnapura", label: "Ratnapura" },
  { value: "Kegalle", label: "Kegalle" },
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
      photoGallery: [],
      serviceableAreas: [],
    },
  });

  const selectedCategory = watch("s_category");
  const photoGallery = watch("photoGallery");
  const selected = watch("serviceableAreas"); //const selected = watch("serviceableAreas") || [] this is also correct or add it in to the default

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

  const handleChange = (selectedOptions: any) => {
    setValue(
      "serviceableAreas",
      selectedOptions.map((option: any) => option.value),
      { shouldValidate: true }
    );
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
      <div className="max-w-full px-4 py-6 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            <div className="flex flex-row gap-6 ">
              <div className="flex-1 space-y-6 px-20 py-10">
                <div className="flex flex-col md:flex-row items-start gap-3">
                  <label
                    htmlFor="service-title"
                    className="md:w-[150px] font-medium"
                  >
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <input
                      type="text"
                      {...register("s_title")}
                      aria-invalid={!!errors.s_title}
                      placeholder="E.g. Elegant Custom Cakes for Every Occasion | Made to Wow"
                      className="p-2 border border-black rounded-sm w-full"
                    />
                    {errors.s_title && (
                      <p className="error-msg">{errors.s_title.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start gap-3">
                  <label
                    htmlFor="service-category"
                    className="md:w-[150px] font-medium"
                  >
                    Service Category <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col md:flex-row gap-2 w-full">
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
                  </div>
                </div>
                {(errors.s_category || errors.s_subcategory) && (
                  <div className="error-msg">
                    {errors.s_category?.message && (
                      <p>{errors.s_category.message}</p>
                    )}
                    {errors.s_subcategory?.message && (
                      <p>{errors.s_subcategory.message}</p>
                    )}
                  </div>
                )}

                <div className="flex flex-col md:flex-row items-start gap-3">
                  <label className="md:w-[150px] font-medium">
                    Search Tags <span className="text-red-500">*</span>
                  </label>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {(watch("s_tags") || []).map(
                        (tag: string, index: number) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded-xl text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(watch("s_tags") || [])];
                                updated.splice(index, 1);
                                setValue("s_tags", updated);
                              }}
                              className="text-white hover:text-black"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )
                      )}
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
                      className="border border-gray-300 rounded p-2 w-full max-w-md"
                    />
                    <p className="text-xs text-gray-600">
                      {watch("s_tags")?.length || 0}/6 tags maximum. Use letters
                      and numbers only.
                    </p>
                    {errors.s_tags && (
                      <p className="error-msg">
                        {errors.s_tags.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center py-6">
                  <Button onClick={() => setCurrentStep(1)}>Next</Button>
                </div>
              </div>

              <div className=" w-full md:w-[380px] bg-[#FFF9EE] border-l-4 border-[#FF9F29] p-6 rounded-md text-sm text-gray-800 space-y-4">
                <div className="flex items-center gap-2 text-[#FF9F29] font-semibold text-base">
                  <TriangleAlert className="w-5 h-5" />
                  Note:
                </div>

                <div>
                  <span className="font-semibold">Service Title - </span>
                  Make it clear, specific, and engaging. It should instantly
                  tell potential clients what service is offered while grabbing
                  their attention. You can refine it later or create multiple
                  services for different services (max of 5 service lists).
                </div>

                <div>
                  <span className="font-semibold">Service Category - </span>
                  Choosing the right category ensures that your service appears
                  in relevant searches, making it easier for the right audience
                  to find the service.
                </div>

                <div>
                  <span className="font-semibold">Search Tags - </span>
                  These improve discoverability by aligning with what potential
                  clients are searching for. Use relevant keywords that reflect
                  the service and industry trends.
                </div>
              </div>
            </div>
          )}

          {/* Form Content step 02 */}
          {currentStep === 1 && (
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <div className="flex-1 space-y-6 px-20 py-10">
                <div className="flex flex-col md:flex-row gap-3">
                  <label
                    htmlFor="service-description"
                    className="md:w-[200px] font-medium"
                  >
                    Service Description <span className="text-red-500">*</span>{" "}
                  </label>
                  <div className="w-full">
                    <textarea
                      {...register("fullDescription")}
                      aria-invalid={!!errors.fullDescription}
                      placeholder="Enter a full description about the vendor and what he does..."
                      className="min-h-[120px] p-2 border border-black rounded-sm w-full"
                    ></textarea>
                    {errors.fullDescription && (
                      <p className="error-msg">
                        {errors.fullDescription.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <label
                    htmlFor="base-price"
                    className="md:w-[200px] font-medium"
                  >
                    Starting Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <input
                      type="number"
                      {...register("basePrice", { valueAsNumber: true })}
                      aria-invalid={!!errors.basePrice}
                      placeholder="E.g. 5000.00"
                      className="w-full max-w-md border rounded p-2"
                    />
                    {errors.basePrice && (
                      <p className="error-msg">{errors.basePrice.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <label
                    htmlFor="base-price-features"
                    className="md:w-[200px] font-medium"
                  >
                    Starting Price Features{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full flex flex-col gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="flex flex-col">
                        <input
                          type="text"
                          placeholder={`Feature ${index + 1}${
                            index < 2 ? " (required)" : " (optional)"
                          }`}
                          {...register(`basePriceFeatures.${index}` as const)}
                          className="border rounded-sm p-2 w-full"
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
                <div className="flex flex-col md:flex-row gap-3">
                  <label
                    htmlFor="cancellation-refund-policy"
                    className="md:w-[200px] font-medium"
                  >
                    Cancellation & Refund Policy{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <input
                      type="text"
                      {...register("cancellationPolicy")}
                      aria-invalid={!!errors.cancellationPolicy}
                      placeholder="Type here..."
                      className="p-2 border border-black rounded-sm w-full"
                    />
                    {errors.cancellationPolicy && (
                      <p className="error-msg">
                        {errors.cancellationPolicy.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 items-center justify-center py-10 px-4">
                  <Button onClick={() => setCurrentStep(0)}>Back</Button>
                  <Button onClick={() => setCurrentStep(2)}>Next</Button>
                </div>
              </div>
              <div className="w-full md:w-[380px] bg-[#FFF9EE] border-l-4 border-[#FF9F29] p-6 rounded-md text-sm text-gray-800 space-y-4">
                <div className="flex items-center gap-2 text-[#FF9F29] font-semibold text-base">
                  <TriangleAlert className="w-5 h-5" />
                  Note:
                </div>

                <div>
                  <span className="font-semibold">Service Description - </span>
                  Provide a clear, engaging overview of what your service
                  includes. Highlight your process, experience, and what makes
                  your offering unique. Mention any specialties, guarantees, or
                  event types you cater to (e.g., weddings, corporate, etc.).
                  Note if you personalize for specific event types like weddings
                  or corporate events. Keep it client-focused and informative
                </div>

                <div>
                  <span className="font-semibold">Starting Price - </span>
                  Enter the base price with clarity. Avoid using low prices just
                  to get clicks, it reduces trust. Be realistic and fair.
                </div>

                <div>
                  <span className="font-semibold">
                    Starting Price Features -{" "}
                  </span>
                  List 2-4 key features that are included in the starting price.
                  Make the first two meaningful and specific.
                </div>

                <div>
                  <span className="font-semibold">
                    Cancellation & Refund Policy -{" "}
                  </span>
                  Be transparent about deposits, refund conditions, and whether
                  cancellations are accepted. Builds client trust.
                </div>
              </div>
            </div>
          )}

          {/* Form Content step 03 */}
          {currentStep === 2 && (
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <div className="flex-1 space-y-6 px-4 py-6">
                <div className="flex flex-col md:flex-row gap-3">
                  <label
                    htmlFor="photo-gallery"
                    className="md:w-[200px] font-medium"
                  >
                    Photo Gallery <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="flex flex-col items-center">
                          <label
                            htmlFor={`photo-${index}`}
                            className="flex flex-col items-center justify-center w-32 h-32 bg-gray-200 border border-gray-300 rounded cursor-pointer hover:bg-gray-300 transition"
                          >
                            {photoGallery[index] ? (
                              <img
                                src={URL.createObjectURL(photoGallery[index])}
                                alt={`Gallery Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <span className="text-sm font-medium text-primary">
                                Choose Image
                              </span>
                            )}
                          </label>
                          <input
                            id={`photo-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            aria-invalid={!!errors.photoGallery}
                            onChange={(e) => {
                              const files = [...(photoGallery || [])];
                              if (e.target.files?.[0]) {
                                files[index] = e.target.files[0];
                                setValue(
                                  "photoGallery",
                                  files.filter(Boolean),
                                  {
                                    shouldValidate: true,
                                  }
                                );
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {errors.photoGallery?.message && (
                      <p className="error-msg mt-2">
                        {errors.photoGallery.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <label
                    htmlFor="serviceable-areas"
                    className="md:w-[200px] font-medium"
                  >
                    Serviceable Areas <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <Select
                      isMulti
                      options={locationOptions}
                      onChange={handleChange}
                      value={locationOptions.filter((opt) =>
                        selected.includes(opt.value)
                      )}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select areas that you can service"
                    />
                    {errors.serviceableAreas && (
                      <p className="error-msg mt-1">
                        {errors.serviceableAreas.message?.toString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <label
                    htmlFor="notice-lead-period"
                    className="md:w-[200px] font-medium"
                  >
                    Notice/Lead Period <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <input
                      type="text"
                      {...register("noticePeriod")}
                      aria-invalid={!!errors.noticePeriod}
                      placeholder="E.g. 2 weeks notice"
                      className="p-2 border border-black rounded-sm w-full"
                    />
                    {errors.noticePeriod && (
                      <p className="error-msg mt-1">
                        {errors.noticePeriod.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <label
                    htmlFor="other-details"
                    className="md:w-[200px] font-medium"
                  >
                    Any Other Details{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="w-full">
                    <input
                      type="text"
                      {...register("otherDetails")}
                      aria-invalid={!!errors.otherDetails}
                      placeholder="Type here..."
                      className="p-2 border border-black rounded-sm w-full"
                    />
                    {errors.otherDetails && (
                      <p className="error-msg mt-1">
                        {errors.otherDetails.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 items-center justify-center py-8">
                  <Button onClick={() => setCurrentStep(1)}>Back</Button>
                  <Button onClick={() => setCurrentStep(3)}>Next</Button>
                </div>
              </div>
              <div className="w-full md:w-[380px] bg-[#FFF9EE] border-l-4 border-[#FF9F29] p-6 rounded-md text-sm text-gray-800 space-y-4">
                <div className="flex items-center gap-2 text-[#FF9F29] font-semibold text-base">
                  <TriangleAlert className="w-5 h-5" />
                  Note:
                </div>

                <div>
                  <span className="font-semibold">Photo Gallery - </span>
                  Upload 1 to 4 high-quality images that best represent your
                  service. Use clear, well-lit visuals.
                </div>

                <div>
                  <span className="font-semibold">Serviceable Areas - </span>
                  Select the cities or regions you serve. Helps clients quickly
                  see your availability in their area.
                </div>

                <div>
                  <span className="font-semibold">Notice/Lead Period - </span>
                  Set how much advance time you require for bookings. It ensures good planning for both sides.
                </div>

                <div>
                  <span className="font-semibold">Any Other Details - </span>
                  Mention special terms, travel fees, weekend availability, or
                  anything else clients should know. Keep it clear and relevant.
                </div>
              </div>
            </div>
          )}

          {/* Form Content step 04 */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Done Publish!</h2>

              <div className="flex gap-3 items-center justify-center py-10 px-4">
                <Button onClick={() => setCurrentStep(2)}>Back</Button>
                <Button type="submit">Submit</Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
