"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactSelect from "react-select";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Pencil,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { vendorFormSchema, VendorFormData } from "./_components/form-schemas";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const page = () => {
  // Timeline effect
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [timelineHeight, setTimelineHeight] = useState<number>(0);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  // Input styles
  const inputContainerStyle = "relative z-0 w-full mb-6 group ";
  const inputStyle = "block shadow py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 hover:border-gray-400 duration-300 hover:shadow-md appearance-none focus:outline-none focus:ring-0 focus:border-[#D39D55] peer"
  const inputLabelStyle = "absolute px-2 text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-medium"
  const selectStyle = "block appearance-none w-full shadow bg-white border-b border-gray-300 hover:border-gray-400 py-2.5 px-2 leading-tight focus:outline-none focus:border-primary transition-colors text-sm text-gray-500 font-medium duration-300 hover:shadow-md";

  useEffect(() => {
    const measureHeight = () => {
      if (formStep === 1 && step1Ref.current) {
        setTimelineHeight(step1Ref.current.offsetHeight);
      } else if (formStep === 2 && step2Ref.current) {
        setTimelineHeight(step2Ref.current.offsetHeight);
      }
    };

    // Run after layout
    const timeout = setTimeout(measureHeight, 0);
    return () => clearTimeout(timeout);
  }, [formStep]);

  // Form data
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const experienceOptions = [
    { value: "just-started", label: "just-started (0-6 months)" },
    { value: "growing", label: "Growing (6 months-2 years)" },
    { value: "established", label: "Established (2-5 years)" },
    { value: "experienced", label: "Experienced (5+ years)" },
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

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Sinhala", label: "Sinhala" },
    { value: "Tamil", label: "Tamil" },
  ];
  const onSubmit = (data: VendorFormData) => {
    console.log("Final Submission:", data);
    // Send to backend here
  };

  return (
    <div
      className="w-full relative bg-background font-sans md:px-10 container mx-auto overflow-x-hidden"
      ref={containerRef}
    >
      {Object.keys(errors).length > 0 && (
        <div className="px-10 py-2 bg-red-200 text-red-500 flex items-center gap-2 text-center justify-center">
          <AlertCircle />
          <span>Please fill all the required fields!</span>
        </div>
      )}

      <div ref={ref} className="relative mx-auto pb-20 overflow-x-hidden">
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
              {/* Step 1 */}
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

                  {/* content */}
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
                          Enter your username *
                        </label>
                        {errors.displayName && (
                          <p className="text-red-500 text-xs italic mt-2">
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
                          <label htmlFor="displayName" className={inputLabelStyle}>
                            Enter display name *
                          </label>
                        {errors.displayName && (
                          <p className="text-red-500 text-xs italic mt-2">
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
                          Enter e-mail *
                        </label>
                        {errors.email && (
                          <p className="text-red-500 text-xs italic mt-2">{errors.email.message}</p>
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
                          Enter a brief description about the vendor and what he does *
                        </label>
                        
                        {errors.about && (
                          <p className="text-red-500 text-xs italic mt-2">{errors.about.message}</p>
                        )}
                      </div>

                      <div className="create-vendor-input-container items-center justify-center pt-10">
                        <label className=" mb-2 text-black/70 font-medium">Profile Picture *</label>
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
                                <p className="text-red-500 text-xs italic mt-2">
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
                  {/* Content */}
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
                          <label htmlFor="businessName" className={inputLabelStyle}>
                            Enter your business name *
                          </label>
                        {errors.businessName && (
                          <p className="text-red-500 text-xs italic mt-2">
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
                          <p className="text-red-500 text-xs italic mt-2">{errors.brn.message}</p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <input
                          type="text"
                          {...register("BusinessAddress")}
                          aria-invalid={!!errors.BusinessAddress}
                          placeholder=""
                          className= {inputStyle}
                        />
                        <label htmlFor="BusinessAddress" className={inputLabelStyle}>
                          Enter your business address *
                        </label>
                        {errors.BusinessAddress && (
                          <p className="text-red-500 text-xs italic mt-2">
                            {errors.BusinessAddress.message}
                          </p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <motion.select
                          {...register("experience", { required: "Experience level is required" })}
                          aria-invalid={!!errors.experience}
                          className={selectStyle}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                          whileFocus={{ scale: 1.01 }}
                        >
                          <option value="" disabled hidden className="text-black">
                            Select your experience level *
                          </option>
                          {experienceOptions.map((option) => (
                            <option key={option.value} value={option.value} className="text-black">
                              {option.label}
                            </option>
                          ))}
                        </motion.select>
                        {errors.experience && (
                          <p className="text-red-500 text-xs italic mt-2 text-xs italic mt-2">
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
                          Website or portfolio link *
                        </label>
                        {errors.website && (
                          <p className="text-red-500 text-xs italic mt-2">
                            {errors.website.message}
                          </p>
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
                            Select your province *
                          </option>
                          {provinceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </motion.select>
                        {errors.province && (
                          <p className="text-red-500 text-xs italic mt-2">
                            {errors.province.message}
                          </p>
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
                            Select your city *
                          </option>
                          <option value="Colombo">Colombo</option>
                          {cityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </motion.select>
                        {errors.city && (
                          <p className="text-red-500 text-xs italic mt-2">{errors.city.message}</p>
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
                        <label htmlFor="businessEmail" className={inputLabelStyle}>
                          Business Email Address *
                        </label>
                        {errors.businessEmail && (
                          <p className="text-red-500 text-xs italic mt-2">
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
                        <label htmlFor="businessPhone" className={inputLabelStyle}>
                          {"Business Phone Number (07X XXX XXXX) *"}
                        </label>
                        {errors.businessPhone && (
                          <p className="text-red-500 text-xs italic mt-2">
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
                  {/* Content */}
                  <div>
                    <div className="timeline-container">
                      <div className=" flex flex-col w-full ">
                        {/* <label>Languages Spoken</label> */}
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
                          <p className="text-red-500 text-xs italic mt-2">
                            {errors.languages.message}
                          </p>
                        )}
                      </div>

                      <div className={inputContainerStyle}>
                        <label htmlFor="socialLinks" className=" px-2 text-sm text-gray-500 origin-[0] font-medium ">
                          Social Media Links
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
                              variant={'ghost'}
                              onClick={() => remove(index)}
                              className="text-red-300 hover:text-red-600"
                            >
                              <X strokeWidth={3} />
                            </Button>
                          </div>
                        ))}
                        {errors.socialLinks && (
                          <p className="text-red-500 text-xs italic mt-2">
                            {errors.socialLinks.message}
                            {Array.isArray(errors.socialLinks) &&
                              errors.socialLinks[0]?.url?.message}
                          </p>
                        )}
                        <Button
                          type="button"
                          variant={'secondary'}
                          onClick={() => append({ url: "" })}
                          className="text-white mt-2 flex items-center justify-center  mx-auto"
                        >
                          <Plus strokeWidth={3} />
                          <span className="font-medium">Add More</span>
                        </Button>
                      </div>

                      <div className={`${inputContainerStyle} mx-auto w-full`}>
                        <label className="px-2 pb-2 text-sm text-gray-500 origin-[0] font-medium">
                          Upload Legal Documents (Business License,
                          Certifications etc.)
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
                                Upload your document here
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

                          {errors.legalDocuments && (
                            <p className="text-red-500 text-xs italic mt-2 mt-2">
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
                          Upload National ID Card * (NID)
                        </label>
                        <div className="flex flex-wrap gap-4 mt-3">
                          {/* NIC Front */}
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
                                        <Button 
                                          variant={"outline"}
                                          className="text-black/60 font-base"
                                        >
                                          Selected File
                                        </Button>
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
                              <p className="text-red-500 text-xs italic mt-2">{errors.nicFront.message}</p>
                            )}
                          </div>

                          {/* NIC Back */}
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
                                        <Button 
                                          variant={"outline"}
                                          className="text-black/60 font-base"
                                        >
                                          Selected File
                                        </Button>
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
                              <p className="text-red-500 text-xs italic mt-2">{errors.nicBack.message}</p>
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
                          <p className="text-red-500 text-xs italic mt-2">
                            {errors.agreeToTerms.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* end buttons */}
              <div className="flex gap-3 items-center justify-end py-10 px-4">
                <button
                  type="button"
                  className="bg-primary ml-0 md:ml-6 px-4 py-2 rounded-[10px] font-semibold text-white duration-300 cursor-pointer "
                  onClick={() => {
                    setFormStep(1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Back
                </button>
                <button

                  className="bg-primary ml-0 md:ml-6 px-4 py-2 rounded-[10px] font-semibold text-white duration-300 "
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default page;
