"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function OfferForm({ conversationId, vendorId }: { conversationId: string, vendorId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const inputContainerStyle = "relative z-0 w-full mb-6 group ";
  const inputStyle =
    "block shadow py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 hover:border-gray-400 duration-300 hover:shadow-md appearance-none focus:outline-none focus:ring-0 focus:border-[#D39D55] peer";
  const inputLabelStyle =
    "absolute px-2 text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-medium";
  

  const handleSendOffer = async () => {
    if (!title || !description || !price) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        conversationId,
        vendorId: vendorId,
        description: `${title}\n\n${description}`,
        price: Number(price),
        expiresAt: null,
      };

      const response = await axios.post("/api/offers/send", payload);

      if (response.status === 200) {
        setTitle("");
        setDescription("");
        setPrice("");
      } else {
        throw new Error("Offer creation failed");
      }
    } catch (error) {
      console.error("Failed to send offer:", error);
      alert("Something went wrong while sending the offer");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white shadow-md rounded p-4 space-y-4 mb-4 max-w-xl mx-auto">
      <div className={inputContainerStyle}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder=""
          className={inputStyle}
        />
        <label htmlFor="title" className={inputLabelStyle}>
          Offer Title
        </label>
      </div>

      <div className={inputContainerStyle}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder=""
          rows={3}
          className={inputStyle}
        />
        <label htmlFor="description" className={inputLabelStyle}>
          Offer Description
        </label>
      </div>

      <div className={inputContainerStyle}>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder=""
          className={inputStyle}
        />
        <label htmlFor="price" className={inputLabelStyle}>
          Price (LKR)
        </label>
      </div>

      <Button
        disabled={loading}
        onClick={handleSendOffer}
      >
        {loading ? "Sending..." : "Send Offer"}
      </Button>
    </div>
  );
}
