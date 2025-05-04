"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { QRSchema, QRFormData } from "@/validation-schemas/qrForm-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function QuotationRequestForm({
  vendorId,
  serviceId,
}: {
  vendorId: string;
  serviceId: string;
}) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QRFormData>({
    resolver: zodResolver(QRSchema),
  });

  const inputContainerStyle = "relative z-0 w-full mb-6 group ";
  const inputStyle =
    "block shadow py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 hover:border-gray-400 duration-300 hover:shadow-md appearance-none focus:outline-none focus:ring-0 focus:border-[#D39D55] peer";
  const inputLabelStyle =
    "absolute px-2 text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-medium";
  const selectStyle =
    "block appearance-none w-full shadow bg-white border-b border-gray-300 hover:border-gray-400 py-2.5 px-2 leading-tight focus:outline-none focus:border-primary transition-colors text-sm text-gray-500 font-medium duration-300 hover:shadow-md";

  const errorStyle = "text-red-500 text-sm ";

  const onSubmit = async (data: QRFormData) => {
    setLoading(true);

    const initialMessage = [
      `**Quotation Request**`,
      ``,
      `**Name:** ${data.fullName}`,
      `**Phone:** ${data.phone}`,
      `**Event:** ${data.eventTitle}`,
      `**Location:** ${data.eventLocation}`,
      `**Date:** ${data.eventDate}`,
      `**Budget:** ${data.budget || "Not specified"}`,
      ``,
      `**Message:**`,
      `${data.message}`,
    ].join("\n");

    try {
      const res = await axios.post("/api/conversations/create", {
        vendorId,
        serviceId,
        initialMessage,
      });

      const conversationId = res.data.conversationId;
      if (conversationId) {
        router.push(`/dashboard/chat/${conversationId}`);
      } else {
        alert("Conversation creation failed.");
      }
    } catch (error: any) {
      console.error("Error:", error?.response?.data || error.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full mx-auto ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 border p-6 rounded shadow max-w-lg bg-white mx-auto"
      >
        <div>
          <h2 className="text-2xl font-bold text-primary text-center pb-3">
            Service Request Form
          </h2>
        </div>
        <div className={inputContainerStyle}>
          <input
            placeholder=""
            {...register("fullName")}
            className={inputStyle}
          />
          <label htmlFor="userName" className={inputLabelStyle}>
            Full Name *
          </label>
          {errors.fullName && (
            <p className={errorStyle}>{errors.fullName.message}</p>
          )}
        </div>

        <div className={inputContainerStyle}>
          <input {...register("phone")} placeholder="" className={inputStyle} />
          <label htmlFor="userName" className={inputLabelStyle}>
            Phone Number *
          </label>
          {errors.phone && <p className={errorStyle}>{errors.phone.message}</p>}
        </div>

        <div className={inputContainerStyle}>
          <input
            {...register("eventTitle")}
            placeholder=""
            className={inputStyle}
          />
          <label htmlFor="userName" className={inputLabelStyle}>
            Event Name or Title *
          </label>
          {errors.eventTitle && (
            <p className={errorStyle}>{errors.eventTitle.message}</p>
          )}
        </div>

        <div className={inputContainerStyle}>
          <input
            {...register("eventDate")}
            placeholder=""
            type="date"
            className={inputStyle}
          />
          <label htmlFor="userName" className={inputLabelStyle}>
            Event Date *
          </label>
          {errors.eventDate && (
            <p className={errorStyle}>{errors.eventDate.message}</p>
          )}
        </div>

        <div className={inputContainerStyle}>
          <input
            {...register("eventLocation")}
            placeholder=""
            className={inputStyle}
          />
          <label htmlFor="userName" className={inputLabelStyle}>
            Event Location *
          </label>
          {errors.eventLocation && (
            <p className={errorStyle}>{errors.eventLocation.message}</p>
          )}
        </div>

        <div className={inputContainerStyle}>
          <input
            {...register("budget")}
            placeholder=""
            className={inputStyle}
            type="number"
          />
          <label htmlFor="userName" className={inputLabelStyle}>
            Estimated Budget (optional)
          </label>
        </div>

        <div className={inputContainerStyle}>
          <textarea
            {...register("message")}
            placeholder=""
            rows={4}
            className={inputStyle}
          />
          <label htmlFor="userName" className={inputLabelStyle}>
            Additional Details...
          </label>
          {errors.message && (
            <p className={errorStyle}>{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading || isSubmitting}>
          {loading ? "Sending..." : "Request Quote & Start Chat"}
        </Button>
      </form>
    </div>
  );
}
