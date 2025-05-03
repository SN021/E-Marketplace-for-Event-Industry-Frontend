"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  ServiceOverview,
} from "@/validation-schemas/create-service-form-schemas";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { eventServiceCategories } from "@/data/categoriesWithsubcategories";
import { locationOptions } from "@/data/locations";
import { motion } from "motion/react";

//options for map function
const steps = [
  { label: "Service Overview" },
  { label: "Service Description & Pricing Details" },
  { label: "Photos & Other Details" },
];

export default function CreateServicePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [subcategories, setSubcategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<
    "checking" | "applied" | "forbidden" | "allowed"
  >("checking");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/get-user");
        const user = response.data?.[0];

        if (!user || !user.role) {
          console.warn("User data or role not found.");
          return;
        }

        if (user.role === "user") {
          setStatus("forbidden");
          return;
        }

        setStatus("allowed");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (status === "forbidden") {
      window.location.href = "/forbidden";
    }
  }, [status]);

  // Form data
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceOverview>({
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
  const selected = watch("serviceableAreas");

  const inputContainerStyle = "relative z-0 w-full mb-6 group ";
  const inputStyle =
    "block shadow py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 hover:border-gray-400 duration-300 hover:shadow-md appearance-none focus:outline-none focus:ring-0 focus:border-[#D39D55] peer";
  const inputLabelStyle =
    "absolute px-2 text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-medium";
  const selectStyle =
    "block appearance-none w-full shadow bg-white border-b border-gray-300 hover:border-gray-400 py-2.5 px-2 leading-tight focus:outline-none focus:border-primary transition-colors text-sm text-gray-500 font-medium duration-300 hover:shadow-md";

  useEffect(() => {
    const matched = eventServiceCategories.find(
      (cat) => cat.value === selectedCategory
    );
    setSubcategories(matched ? matched.subcategories : []);
    setValue("s_subcategory", "");
  }, [selectedCategory, setValue]);

  const handleChange = (selectedOptions: any) => {
    setValue(
      "serviceableAreas",
      selectedOptions.map((option: any) => option.value),
      { shouldValidate: true }
    );
  };

  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: ServiceOverview) => {
    setLoading(true);
    try {
      const userId = user?.id;
      const formData = new FormData();
      data.photoGallery.forEach((file: File) => {
        formData.append("images", file);
      });

      const uploadRes = await fetch("/api/upload-service", {
        method: "POST",
        body: formData,
      });

      const uploadJson = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadJson.error);

      const payload = {
        ...data,
        userId,
        photoGalleryPaths: uploadJson.paths,
      };

      const response = await axios.post("/api/create-service", payload);
      toast.success("Service has been created");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Upload or submission failed:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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

      <div className="max-w-full px-4 py-6 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form Content step 01 */}
          {currentStep === 0 && (
            <div className="flex flex-col md:flex-row md:divide-x bg-white rounded-md shadow-md md:divide-gray-300 ">
              {/* Form Section */}
              <div className="flex-1 items-center justify-center px-5 md:px-15 lg:px-24 py-10 space-y-6 ">
                {/* Service Title */}
                <div className={inputContainerStyle}>
                  <input
                    type="text"
                    id="service-title"
                    {...register("s_title")}
                    aria-invalid={!!errors.s_title}
                    placeholder=""
                    className={inputStyle}
                  />
                  <label htmlFor="service-title" className={inputLabelStyle}>
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  {errors.s_title && (
                    <p className="error-msg">{errors.s_title.message}</p>
                  )}
                </div>

                {/* Service Category + Subcategory */}
                <div className={inputContainerStyle}>
                  <div className="flex flex-col md:flex-row gap-2 w-full">
                    <motion.select
                      {...register("s_category")}
                      aria-invalid={!!errors.s_category}
                      className={selectStyle}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      whileFocus={{ scale: 1.01 }}
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
                    </motion.select>

                    <motion.select
                      {...register("s_subcategory")}
                      aria-invalid={!!errors.s_subcategory}
                      className={selectStyle}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      whileFocus={{ scale: 1.01 }}
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
                    </motion.select>
                  </div>
                </div>

                {/* Search Tags */}
                <div className="flex flex-col md:flex-row items-start gap-3">
                  <div className={inputContainerStyle}>
                    {/* Input Field */}
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
                      placeholder=""
                      className={inputStyle}
                    />
                    <label className={inputLabelStyle}>
                      Search Tags <span className="text-red-500">*</span>
                    </label>

                    <p className="text-xs text-gray-600">
                      {watch("s_tags")?.length || 0}/6 tags maximum. Use letters
                      and numbers only. Type and press Enter...
                    </p>

                    {/* Tag List */}
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

                    {errors.s_tags && (
                      <p className="error-msg">
                        {errors.s_tags.message as string}
                      </p>
                    )}
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex items-center justify-center py-6">
                  <Button onClick={() => setCurrentStep(1)}>Next</Button>
                </div>
              </div>

              {/* Note Section */}
              <div className="w-full md:max-w-sm px-6 py-10 bg-[#FFF9EE] space-y-4 text-sm text-gray-800">
                <div className="flex items-center gap-2 text-[#FF9F29] font-semibold text-base">
                  <TriangleAlert className="w-5 h-5" />
                  Note:
                </div>

                <div>
                  <span className="font-semibold">Service Title - </span>
                  Make it clear, specific, and engaging. It should instantly
                  tell potential clients what service is offered while grabbing
                  their attention. You can refine it later or create multiple
                  services (max 5).
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
                  your service and industry trends.
                </div>
              </div>
            </div>
          )}

          {/* Form Content step 02 */}
          {currentStep === 1 && (
            <div className="flex flex-col md:flex-row md:divide-x bg-white rounded-md shadow-md md:divide-gray-300 ">
              <div className="flex-1 items-center justify-center px-5 md:px-15 lg:px-24 py-10 space-y-6">
                <div className={inputContainerStyle}>
                  <textarea
                    {...register("fullDescription")}
                    aria-invalid={!!errors.fullDescription}
                    placeholder=""
                    className={inputStyle}
                  />
                  <label
                    htmlFor="service-description"
                    className={inputLabelStyle}
                  >
                    Service Description <span className="text-red-500">*</span>{" "}
                  </label>
                  {errors.fullDescription && (
                    <p className="error-msg">
                      {errors.fullDescription.message}
                    </p>
                  )}
                </div>
                <div className={inputContainerStyle}>
                  <input
                    type="number"
                    {...register("basePrice", { valueAsNumber: true })}
                    aria-invalid={!!errors.basePrice}
                    placeholder=""
                    className={inputStyle}
                  />
                  <label htmlFor="base-price" className={inputLabelStyle}>
                    Starting Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  {errors.basePrice && (
                    <p className="error-msg">{errors.basePrice.message}</p>
                  )}
                </div>

                <div className="w-full flex flex-col gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className={inputContainerStyle}>
                      <input
                        type="text"
                        placeholder=""
                        {...register(`basePriceFeatures.${index}` as const)}
                        className={inputStyle}
                      />
                      <label
                        htmlFor="base-price-features"
                        className={inputLabelStyle}
                      >
                        {`Feature ${index + 1}${
                          index < 2 ? " (required)" : " (optional)"
                        }`}
                        <span className="text-red-500">*</span>
                      </label>
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

                <div className={inputContainerStyle}>
                  <input
                    type="text"
                    {...register("cancellationPolicy")}
                    aria-invalid={!!errors.cancellationPolicy}
                    placeholder=""
                    className={inputStyle}
                  />
                  <label
                    htmlFor="cancellation-refund-policy"
                    className={inputLabelStyle}
                  >
                    Cancellation & Refund Policy{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  {errors.cancellationPolicy && (
                    <p className="error-msg">
                      {errors.cancellationPolicy.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 items-center justify-center py-6">
                  <Button onClick={() => setCurrentStep(0)}>Back</Button>
                  <Button onClick={() => setCurrentStep(2)}>Next</Button>
                </div>
              </div>
              {/* Note Section - Made consistent with step 1 */}
              <div className="w-full md:max-w-sm px-6 py-10 bg-[#FFF9EE] space-y-4 text-sm text-gray-800">
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
            <div className="flex flex-col md:flex-row md:divide-x bg-white rounded-md shadow-md md:divide-gray-300">
              <div className="flex-1 items-center justify-center px-5 md:px-15 lg:px-24 py-10 space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <label
                    htmlFor="photo-gallery"
                    className="text-sm text-gray-500 font-semibold"
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

                <div className="flex flex-col md:flex-row items-start gap-3">
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
                <div className={inputContainerStyle}>
                  <input
                    type="text"
                    {...register("noticePeriod")}
                    aria-invalid={!!errors.noticePeriod}
                    placeholder=""
                    className={inputStyle}
                  />
                  <label
                    htmlFor="notice-lead-period"
                    className={inputLabelStyle}
                  >
                    Notice/Lead Period <span className="text-red-500">*</span>
                  </label>
                  {errors.noticePeriod && (
                    <p className="error-msg mt-1">
                      {errors.noticePeriod.message}
                    </p>
                  )}
                </div>
                <div className={inputContainerStyle}>
                  <input
                    type="text"
                    {...register("otherDetails")}
                    aria-invalid={!!errors.otherDetails}
                    placeholder="Type here..."
                    className={inputStyle}
                  />
                  <label htmlFor="other-details" className={inputLabelStyle}>
                    Any Other Details <span>(Optional)</span>
                  </label>
                  {errors.otherDetails && (
                    <p className="error-msg mt-1">
                      {errors.otherDetails.message}
                    </p>
                  )}
                </div>

                <div className={inputContainerStyle}>
                  <input
                    type="text"
                    {...register("discountsAndOffers")}
                    placeholder="Type here..."
                    className={inputStyle}
                  />
                  <label
                    htmlFor="discounts-and-offers"
                    className={inputLabelStyle}
                  >
                    Discounts & Offers <span>(Optional)</span>
                  </label>
                  {errors.discountsAndOffers && (
                    <p className="error-msg mt-1">
                      {errors.discountsAndOffers.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 items-center justify-center py-6">
                  <Button onClick={() => setCurrentStep(1)}>Back</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
              {/* Note Section - Made consistent with step 1 */}
              <div className="w-full md:max-w-sm px-6 py-10 bg-[#FFF9EE] space-y-4 text-sm text-gray-800">
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
                  Set how much advance time you require for bookings. It ensures
                  good planning for both sides.
                </div>

                <div>
                  <span className="font-semibold">Any Other Details - </span>
                  Mention special terms, travel fees, weekend availability, or
                  anything else clients should know. Keep it clear and relevant.
                </div>

                <div>
                  <span className="font-semibold">Discounts & Offers - </span>
                  Mention seasonal offers, first-time deals, etc.
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
