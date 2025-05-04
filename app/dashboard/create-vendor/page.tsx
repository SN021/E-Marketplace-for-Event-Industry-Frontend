"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactSelect from "react-select";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  LoaderPinwheel,
  MessageCircleWarning,
  Pencil,
  Plus,
  Upload,
  X,
} from "lucide-react";
import {
  vendorFormSchema,
  VendorFormData,
} from "@/validation-schemas/create-vendor-form-schemas";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const page = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<
    "checking" | "applied" | "forbidden" | "allowed"
  >("checking");
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [timelineHeight, setTimelineHeight] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/get-user");
        const user = response.data?.[0];

        if (!user || !user.role) {
          console.warn("User data or role not found.");
          return;
        }

        if (user.role === "vendor") {
          setStatus("forbidden");
          return;
        }

        if (user.is_vendor === true && user.role === "user") {
          setStatus("applied");
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

  useEffect(() => {
    const measureHeight = () => {
      if (formStep === 1 && step1Ref.current) {
        setTimelineHeight(step1Ref.current.offsetHeight);
      } else if (formStep === 2 && step2Ref.current) {
        setTimelineHeight(step2Ref.current.offsetHeight);
      }
    };

    const timeout = setTimeout(measureHeight, 0);
    return () => clearTimeout(timeout);
  }, [formStep]);

  // Input styles
  const inputContainerStyle = "relative z-0 w-full mb-6 group ";
  const inputStyle =
    "block shadow py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 hover:border-gray-400 duration-300 hover:shadow-md appearance-none focus:outline-none focus:ring-0 focus:border-[#D39D55] peer";
  const inputLabelStyle =
    "absolute px-2 text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-medium";
  const selectStyle =
    "block appearance-none w-full shadow bg-white border-b border-gray-300 hover:border-gray-400 py-2.5 px-2 leading-tight focus:outline-none focus:border-primary transition-colors text-sm text-gray-500 font-medium duration-300 hover:shadow-md";

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      experience: "",
      province: "",
      city: "",
      languages: [],
      socialLinks: [{ url: "" }],
      legalDocuments: undefined,
    },
  });
  const profilePicture = watch("profilePicture");
  const legalDocuments = watch("legalDocuments");
  const nicFront = watch("nicFront");
  const nicBack = watch("nicBack");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const experienceOptions = [
    { value: "just-started (0-6 months)", label: "Just-started (0-6 months)" },
    {
      value: "growing (6-24 months)",
      label: "Growing (6-24 months)",
    },
    { value: "established (2-5 years)", label: "Established (2-5 years)" },
    { value: "experienced (5+ years)", label: "Experienced (5+ years)" },
  ];

  const provinceOptions = [
    { value: "Central", label: "Central" },
    { value: "Eastern", label: "Eastern" },
    { value: "Northern", label: "Northern" },
    { value: "North Central", label: "North Central" },
    { value: "North Western", label: "North Western" },
    { value: "Sabaragamuwa", label: "Sabaragamuwa" },
    { value: "Southern", label: "Southern" },
    { value: "Uva", label: "Uva" },
    { value: "Western", label: "Western" },
  ];

  const cityOptions = [
    { value: "Ampara", label: "Ampara" },
    { value: "Anuradhapura", label: "Anuradhapura" },
    { value: "Avissawella", label: "Avissawella" },
    { value: "Badulla", label: "Badulla" },
    { value: "Batticaloa", label: "Batticaloa" },
    { value: "Beruwala", label: "Beruwala" },
    { value: "Chilaw", label: "Chilaw" },
    { value: "Colombo", label: "Colombo" },
    { value: "Dehiwala-Mount Lavinia", label: "Dehiwala-Mount Lavinia" },
    { value: "Eravur", label: "Eravur" },
    { value: "Galle", label: "Galle" },
    { value: "Gampaha", label: "Gampaha" },
    { value: "Hambantota", label: "Hambantota" },
    { value: "Hatton", label: "Hatton" },
    { value: "Homagama", label: "Homagama" },
    { value: "Jaffna", label: "Jaffna" },
    { value: "Kalmunai", label: "Kalmunai" },
    { value: "Kalutara", label: "Kalutara" },
    { value: "Kandy", label: "Kandy" },
    { value: "Katunayake", label: "Katunayake" },
    { value: "Kegalle", label: "Kegalle" },
    { value: "Kilinochchi", label: "Kilinochchi" },
    { value: "Kurunegala", label: "Kurunegala" },
    { value: "Mannar", label: "Mannar" },
    { value: "Matale", label: "Matale" },
    { value: "Matara", label: "Matara" },
    { value: "Monaragala", label: "Monaragala" },
    { value: "Moratuwa", label: "Moratuwa" },
    { value: "Mullaitivu", label: "Mullaitivu" },
    { value: "Negombo", label: "Negombo" },
    { value: "Nuwara Eliya", label: "Nuwara Eliya" },
    { value: "Panadura", label: "Panadura" },
    { value: "Polonnaruwa", label: "Polonnaruwa" },
    { value: "Puttalam", label: "Puttalam" },
    { value: "Ratnapura", label: "Ratnapura" },
    { value: "Trincomalee", label: "Trincomalee" },
    { value: "Vavuniya", label: "Vavuniya" },
    { value: "Wattala", label: "Wattala" },
  ];

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Sinhala", label: "Sinhala" },
    { value: "Tamil", label: "Tamil" },
  ];

  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const uploadFile = async (
    file: File,
    type: string,
    userId: string
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("userId", userId);

    try {
      const res = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();
      return result.signedUrl;
    } catch (error) {
      console.error(`Upload failed for ${type}:`, error);
      toast.error(`Failed to upload ${type} file.`);
      return null;
    }
  };

  const onSubmit = async (data: VendorFormData) => {
    setLoading(true);

    if (!isLoaded || !isSignedIn) {
      toast.error("You must be signed in to submit this form.");
      return;
    }

    try {
      const userId = user?.id;
      const payload = {
        ...data,
        userId,
      };

      const response = await axios.post("/api/create-vendor", payload);

      const profilePicUrl = profilePicture?.[0]
        ? await uploadFile(profilePicture[0], "profile", userId)
        : null;
      const legalDocUrl = legalDocuments?.[0]
        ? await uploadFile(legalDocuments[0], "legal", userId)
        : null;
      const nicFrontUrl = nicFront?.[0]
        ? await uploadFile(nicFront[0], "nicFront", userId)
        : null;
      const nicBackUrl = nicBack?.[0]
        ? await uploadFile(nicBack[0], "nicBack", userId)
        : null;

      toast.success("Vendor profile created successfully!");
      router.push("/dashboard/create-vendor/onboarding");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to create vendor profile.";
      toast.error(message);
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "checking") {
    return <Loader />;
  }

  if (status === "applied") {
    return (
      <div className="mx-auto max-w-xl my-10 p-6 bg-yellow-50 border-l-4 border-primary text-yellow-800 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 justify-center">
          <span>
            <MessageCircleWarning />
          </span>
          Vendor Request Pending
        </h2>
        <p className="text-sm">
          You’ve already submitted a vendor application. Please wait while an
          administrator reviews and approves your request.
        </p>
        <div className="flex items-center justify-center mt-5">
          <Button onClick={() => router.push("/dashboard")} className="">
            Go back
          </Button>
        </div>
      </div>
    );

  }

  return (
    <div
      className={cn(
        "w-full relative bg-background font-sans md:px-10 container mx-auto overflow-x-hidden"
      )}
      ref={containerRef}
    >
      {loading && (
        <div className="w-full h-full bg-white z-20 text-primary animate-spin">
          <LoaderPinwheel />
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="px-10 py-2 bg-red-200 text-red-500 flex items-center gap-2 text-center justify-center">
          <AlertCircle />
          <span>Please fill all the required fields!</span>
        </div>
      )}

      <div
        ref={ref}
        className={cn("relative mx-auto pb-20 overflow-x-hidden", {
          loading: "hidden",
        })}
      >
        <div className="absolute left-8 top-0 w-[2px]">
          <motion.div
            animate={{ height: timelineHeight }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-[2px] bg-gradient-to-t from-black via-primary to-transparent rounded-full"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-hidden">
          {formStep === 1 && (
            <div ref={step1Ref}>
              {/* Step 1  */}
              <div
                className={cn("flex justify-start pt-10 md:pt-40 md:gap-10")}
              >
                <div className="sticky flex flex-col md:flex-row z-40 items-center justify-center top-40 self-start max-w-xs lg:max-w-sm lg:w-full">
                  <div className="h-10 absolute left-3 lg:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-zinc-800 border border-neutral-300 p-2" />
                  </div>
                  <h3 className="hidden lg:block text-xl md:pl-20 md:text-3xl font-bold text-neutral-500 ">
                    Step 01: Basic Information
                  </h3>
                </div>

                <div className="relative pl-20 pr-4 md:pl-4 w-full ">
                  <h3 className="lg:hidden block text-2xl md:text-3xl mb-4 text-left font-bold text-neutral-500">
                    Step 01: Basic Information
                  </h3>

                  <div className="pl-0 md:pl-10 lg:pl-0">
                    <div className="timeline-container">
                      <div className={inputContainerStyle}>
                        <input
                          type="text"
                          {...register("userName")}
                          aria-invalid={!!errors.userName}
                          placeholder=""
                          className={inputStyle}
                        />
                        <label htmlFor="userName" className={inputLabelStyle}>
                          Username *
                        </label>
                        {errors.displayName && (
                          <p className="error-msg">
                            {errors.userName?.message}
                          </p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <input
                          type="text"
                          {...register("displayName")}
                          aria-invalid={!!errors.displayName}
                          placeholder=""
                          className={inputStyle}
                        />
                        <label
                          htmlFor="displayName"
                          className={inputLabelStyle}
                        >
                          Display Name *
                        </label>
                        {errors.displayName && (
                          <p className="error-msg">
                            {errors.displayName.message}
                          </p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <input
                          type="email"
                          {...register("email")}
                          aria-invalid={!!errors.email}
                          placeholder=""
                          className={inputStyle}
                        />
                        <label htmlFor="email" className={inputLabelStyle}>
                          E-mail Address*
                        </label>
                        {errors.email && (
                          <p className="error-msg">{errors.email.message}</p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <textarea
                          {...register("about")}
                          aria-invalid={!!errors.about}
                          placeholder=""
                          className={`${inputStyle} h-32`}
                        />
                        <label htmlFor="about" className={inputLabelStyle}>
                          Enter a brief description about the vendor and what he
                          does *
                        </label>
                        {errors.about && (
                          <p className="error-msg">{errors.about.message}</p>
                        )}
                      </div>

                      <div className="create-vendor-input-container items-center justify-center pt-10">
                        <label className=" mb-2 text-black/55 font-bold text-sm">
                          Profile Picture *
                        </label>
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative h-32 flex w-32">
                            <div className="flex items-center justify-center">
                              <div className="w-32 h-32 rounded-full bg-gray-200 shadow-md flex items-center justify-center overflow-hidden">
                                {profilePicture && profilePicture.length > 0 ? (
                                  <img
                                    src={URL.createObjectURL(profilePicture[0])}
                                    alt="Profile Preview"
                                    className="w-32 h-32 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-gray-400">Image</span>
                                )}
                              </div>
                              <label
                                htmlFor="profile-upload"
                                className="bg-gray-100/80 p-2 rounded-full shadow-md -ml-2"
                              >
                                <Pencil className="w-4 h-4 text-gray-600" />
                              </label>
                              <input
                                type="file"
                                id="profile-upload"
                                {...register("profilePicture")}
                                aria-invalid={!!errors.profilePicture}
                                accept="image/*"
                                className="hidden"
                              />
                            </div>
                          </div>
                          <div>
                            {errors.profilePicture && (
                              <div>
                                <p className="error-msg">
                                  {errors.profilePicture.message}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={cn("flex justify-start pt-10 md:pt-40 md:gap-10")}
              >
                <div className="sticky flex flex-col lg:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm lg:w-full">
                  <div className="h-10 absolute left-3 lg:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-zinc-800 border border-neutral-300 p-2" />
                  </div>
                  <h3 className="hidden lg:block text-xl lg:pl-20 md:text-3xl font-bold text-neutral-500 ">
                    Step 02: Business Details
                  </h3>
                </div>

                <div className="relative pl-20 pr-4 md:pl-4 w-full">
                  <h3 className="lg:hidden block text-2xl mb-4 text-left font-bold text-neutral-500">
                    Step 02: Business Details
                  </h3>
                  <div className="pl-0 md:pl-10 lg:pl-0">
                    <div className="timeline-container">
                      <div className={inputContainerStyle}>
                        <input
                          type="text"
                          {...register("businessName")}
                          aria-invalid={!!errors.businessName}
                          placeholder=""
                          className={inputStyle}
                        />
                        <label
                          htmlFor="businessName"
                          className={inputLabelStyle}
                        >
                          Business Name *
                        </label>
                        {errors.businessName && (
                          <p className="error-msg">
                            {errors.businessName.message}
                          </p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <input
                          type="text"
                          {...register("brn")}
                          aria-invalid={!!errors.brn}
                          placeholder=""
                          className={inputStyle}
                        />
                        <label htmlFor="brn" className={inputLabelStyle}>
                          Business Registration Number (optional)
                        </label>
                        {errors.brn && (
                          <p className="error-msg">{errors.brn.message}</p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <input
                          type="text"
                          {...register("businessAddress")}
                          aria-invalid={!!errors.businessAddress}
                          placeholder=""
                          className={inputStyle}
                        />
                        <label
                          htmlFor="businessAddress"
                          className={inputLabelStyle}
                        >
                          Business Address *
                        </label>
                        {errors.businessAddress && (
                          <p className="error-msg">
                            {errors.businessAddress.message}
                          </p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <motion.select
                          {...register("experience", {
                            required: "Experience level is required",
                          })}
                          aria-invalid={!!errors.experience}
                          className={selectStyle}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                          whileFocus={{ scale: 1.01 }}
                        >
                          <option
                            value=""
                            disabled
                            hidden
                            className="text-black"
                          >
                            Experience Level *
                          </option>
                          {experienceOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className="text-black"
                            >
                              {option.label}
                            </option>
                          ))}
                        </motion.select>
                        {errors.experience && (
                          <p className="error-msg ">
                            {errors.experience.message}
                          </p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <input
                          type="url"
                          {...register("website")}
                          aria-invalid={!!errors.website}
                          placeholder=""
                          className={inputStyle}
                        />
                        <label htmlFor="website" className={inputLabelStyle}>
                          Website or Portfolio Link (optional)
                        </label>
                        {errors.website && (
                          <p className="error-msg">{errors.website.message}</p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <motion.select
                          {...register("province")}
                          aria-invalid={!!errors.province}
                          className={selectStyle}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                          whileFocus={{ scale: 1.01 }}
                        >
                          <option value="" disabled hidden>
                            Province *
                          </option>
                          {provinceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </motion.select>
                        {errors.province && (
                          <p className="error-msg">{errors.province.message}</p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <motion.select
                          {...register("city")}
                          aria-invalid={!!errors.city}
                          className={selectStyle}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                          whileFocus={{ scale: 1.01 }}
                        >
                          <option value="" disabled hidden>
                            City *
                          </option>
                          <option value="Colombo">Colombo</option>
                          {cityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </motion.select>
                        {errors.city && (
                          <p className="error-msg">{errors.city.message}</p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <input
                          type="email"
                          {...register("businessEmail")}
                          aria-invalid={!!errors.businessEmail}
                          placeholder=""
                          className={inputStyle}
                        />
                        <label
                          htmlFor="businessEmail"
                          className={inputLabelStyle}
                        >
                          Business Email Address *
                        </label>
                        {errors.businessEmail && (
                          <p className="error-msg">
                            {errors.businessEmail.message}
                          </p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <input
                          type="Tel"
                          {...register("businessPhone")}
                          aria-invalid={!!errors.businessPhone}
                          placeholder=""
                          className={inputStyle}
                        />
                        <label
                          htmlFor="businessPhone"
                          className={inputLabelStyle}
                        >
                          {"Business Phone Number (07X XXX XXXX) *"}
                        </label>
                        {errors.businessPhone && (
                          <p className="error-msg">
                            {errors.businessPhone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-end py-10 px-4">
                <button
                  type="submit"
                  className="bg-primary ml-0 md:ml-6 px-4 py-2 rounded-[10px] font-semibold text-white duration-300 w-[100px]  cursor-pointer "
                  onClick={() => {
                    setFormStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div ref={step2Ref}>
              {/* Step 3 */}
              <div
                className={cn("flex justify-start pt-10 md:pt-40 md:gap-10")}
              >
                <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm lg:w-full">
                  <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-zinc-800 border border-neutral-300 p-2" />
                  </div>
                  <h3 className="hidden lg:block text-xl md:pl-20 md:text-3xl font-bold text-neutral-500 ">
                    Step 03: Additional Information
                  </h3>
                </div>

                <div className="relative pl-20 pr-4 md:pl-4 w-full">
                  <h3 className="lg:hidden block text-2xl md:text-3xl mb-4 text-left font-bold text-neutral-500">
                    Step 03: Additional Information
                  </h3>
                  <div>
                    <div className="timeline-container">
                      <div className=" flex flex-col w-full ">
                        <Controller
                          control={control}
                          name="languages"
                          render={({ field }) => (
                            <ReactSelect
                              isMulti
                              options={languageOptions}
                              placeholder="Languages Spoken"
                              value={languageOptions.filter((opt) =>
                                field.value.includes(opt.value)
                              )}
                              onChange={(selected) =>
                                field.onChange(selected.map((s) => s.value))
                              }
                              className={`react-select-container focus:outline-primary`}
                              classNamePrefix="react-select"
                            />
                          )}
                        />
                        {errors.languages && (
                          <p className="error-msg">
                            {errors.languages.message}
                          </p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <label
                          htmlFor="socialLinks"
                          className=" px-2 text-sm text-gray-500 origin-[0] font-medium "
                        >
                          Social Media Links (optional)
                        </label>
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex gap-2 mb-2">
                            <input
                              type="URL"
                              {...register(`socialLinks.${index}.url`)}
                              placeholder="https://www.example.com/@account-name"
                              aria-invalid={!!errors.socialLinks}
                              className={inputStyle}
                            />
                            <Button
                              type="button"
                              variant={"ghost"}
                              onClick={() => remove(index)}
                              className="text-red-300 hover:text-red-600"
                            >
                              <X strokeWidth={3} />
                            </Button>
                          </div>
                        ))}
                        {errors.socialLinks && (
                          <p className="error-msg">
                            {errors.socialLinks.message}
                            {Array.isArray(errors.socialLinks) &&
                              errors.socialLinks[0]?.url?.message}
                          </p>
                        )}
                        <Button
                          type="button"
                          variant={"secondary"}
                          onClick={() => append({ url: "" })}
                          className="text-white mt-2 flex items-center justify-center  mx-auto"
                        >
                          <Plus strokeWidth={3} />
                          <span className="font-medium">Add More</span>
                        </Button>
                      </div>

                      <div className={`${inputContainerStyle} mx-auto w-full`}>
                        <label className="px-2 pb-2 text-sm text-gray-500 origin-[0] font-medium">
                          Legal Documents (Business License, Certifications
                          etc.)
                        </label>

                        <div className="w-full flex flex-col items-center justify-center">
                          <label
                            htmlFor="legal-upload"
                            className="w-full bg-[#FAF6ED] shadow-md rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer max-w-md mt-5 mx-auto"
                          >
                            <div className="text-center m-auto">
                              <div className="flex items-center justify-center mb-2">
                                <Upload />
                              </div>
                              <p className="mb-3 text-zinc-500">
                                Upload your document here (optional)
                              </p>

                              {watch("legalDocuments")?.length > 0 && (
                                <p className="text-sm text-zinc-600 mt-2">
                                  Selected: {watch("legalDocuments")[0].name}
                                </p>
                              )}
                            </div>
                          </label>

                          <input
                            id="legal-upload"
                            type="file"
                            {...register("legalDocuments")}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            className="hidden"
                          />

                          {errors.legalDocuments?.message &&
                            typeof errors.legalDocuments.message ===
                              "string" && (
                              <p className="error-msg">
                                {errors.legalDocuments.message}
                              </p>
                            )}

                          <p className="text-[12px] text-black font-italic mt-4 opacity-50 w-full max-w-sm mx-auto text-center">
                            <span className="text-red-500 font-bold">*</span>
                            Adding your BRN, Business License, or Certifications
                            will help you get verified within one day
                            <span className="text-red-500 font-bold">*</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex justify-start pt-10 md:pt-40 md:gap-10">
                <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm lg:w-full">
                  <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-zinc-800 border border-neutral-300 p-2" />
                  </div>
                  <h3 className="hidden lg:block text-xl md:pl-20 md:text-3xl font-bold text-neutral-500 ">
                    Step 04: Account Verification & Security
                  </h3>
                </div>

                <div className="relative pl-20 pr-4 md:pl-4 w-full">
                  <h3 className="lg:hidden block text-2xl md:text-3xl mb-4 text-left font-bold text-neutral-500">
                    Step 04: Account Verification & Security
                  </h3>

                  {/* content */}
                  <div className="flex flex-col">
                    <div className="timeline-container">
                      <div className=" flex justify-between items-center w-full">
                        <label className="px-2 text-sm text-gray-500 origin-[0] font-medium">
                          Email Verification
                        </label>
                        <button
                          className="bg-primary ml-0 md:ml-6 px-4 py-2 rounded-[10px] font-semibold text-white"
                          disabled
                        >
                          Verified
                        </button>
                      </div>

                      <div className={inputContainerStyle}>
                        <label className="px-2 text-sm text-gray-500 origin-[0] font-medium">
                          National ID Card * (NID)
                        </label>
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="flex-1 min-w-[250px] max-w-[600px] h-fit">
                            <label
                              htmlFor="nic-front"
                              className="w-full bg-[#FAF6ED] shadow-md rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer min-h-[200px]"
                            >
                              <div className="text-center m-auto">
                                <div className="flex items-center justify-center mb-2">
                                  <Upload />
                                </div>
                                <p className="mb-3 text-zinc-500 text-center text-sm">
                                  Upload front side of your NIC
                                </p>

                                {watch("nicFront")?.length > 0 && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <div className="text-black/60 font-base">
                                          Selected File
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white shadow-lg text-black text-sm font-medium">
                                        <p
                                          className="text-sm text-zinc-600 mt-2 overflow-hidden text-ellipsis whitespace-nowrap mx-auto text-center"
                                          title={watch("nicFront")[0].name}
                                        >
                                          Selected: {watch("nicFront")[0].name}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </label>
                            <input
                              id="nic-front"
                              type="file"
                              {...register("nicFront")}
                              accept=".png,.jpg,.jpeg"
                              className="hidden"
                            />
                            {errors.nicFront && (
                              <p className="error-msg">
                                {errors.nicFront.message}
                              </p>
                            )}
                          </div>
                          <div className="flex-1 min-w-[250px] max-w-[500px] h-fit">
                            <label
                              htmlFor="nic-back"
                              className="w-full bg-[#FAF6ED] shadow-md rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer min-h-[200px]"
                            >
                              <div className="text-center m-auto">
                                <div className="flex items-center justify-center mb-2">
                                  <Upload />
                                </div>
                                <p className="mb-3 text-zinc-500 text-center text-sm">
                                  Upload back side of your NIC
                                </p>

                                {watch("nicBack")?.length > 0 && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <div className="text-black/60 font-base">
                                          Selected File
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white shadow-lg text-black text-sm font-medium">
                                        <p
                                          className="text-sm text-zinc-600 mt-2 overflow-hidden text-ellipsis whitespace-nowrap mx-auto text-center"
                                          title={watch("nicBack")[0].name}
                                        >
                                          Selected: {watch("nicBack")[0].name}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </label>
                            <input
                              id="nic-back"
                              type="file"
                              {...register("nicBack")}
                              accept=".png,.jpg,.jpeg"
                              className="hidden"
                            />
                            {errors.nicBack && (
                              <p className="error-msg">
                                {errors.nicBack.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row gap-3 mt-5">
                          <input
                            type="checkbox"
                            id="terms&conditions"
                            {...register("agreeToTerms")}
                          />
                          <label>
                            Agree to privacy policy & terms of services
                          </label>
                        </div>
                        {errors.agreeToTerms && (
                          <p className="error-msg">
                            {errors.agreeToTerms.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-end py-10 px-4">
                <Button
                  type="button"
                  onClick={() => {
                    setFormStep(1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <LoaderPinwheel className="animate-spin w-4 h-4 mr-2" />
                  ) : null}
                  {loading ? "Submitting..." : "Save & Continue"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default page;
