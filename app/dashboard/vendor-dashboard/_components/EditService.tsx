"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { Bounce, toast } from "react-toastify";
import { HashLoader } from "react-spinners";


type EditServiceProps = {
  id: string;
  onCancel?: () => void;
};

export default function EditService({ id, onCancel }: EditServiceProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const serviceUpdateMsg = () => {
      toast.success("Service updated successfully.", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    };
    const errorMsg = () => {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    };

  const [form, setForm] = useState({
    service_description: "",
    service_title: "",
    price_features: "",
    starting_price: "",
    discounts_and_offers: "",
    servicable_areas: "",
    notice_period: "",
    policies: "",
    other_details: "",
    search_tags: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`/api/services/edit-service/${id}`);
        setData(res.data);


        setForm({
          service_description: res.data.description || "",
          service_title: res.data.service_title || "",
          price_features: Array.isArray(res.data.price_features)
            ? res.data.price_features.join(", ")
            : JSON.parse(res.data.price_features || "[]").join(", "),
          starting_price: res.data.starting_price || "",
          discounts_and_offers: res.data.discounts_and_offers || "",
          servicable_areas: Array.isArray(res.data.serviceable_areas)
            ? res.data.serviceable_areas.join(", ")
            : JSON.parse(res.data.serviceable_areas || "[]").join(", "),
          notice_period: res.data.notice_period || "",
          policies: res.data.policies || "",
          other_details: res.data.other_details || "",
          search_tags: Array.isArray(res.data.search_tags)
            ? res.data.search_tags.join(", ")
            : JSON.parse(res.data.search_tags || "[]").join(", "),
        });
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch(`/api/services/edit-service/${id}`, {
        ...form,
        servicable_areas: form.servicable_areas.split(",").map((a) => a.trim()),
        price_features: form.price_features.split(",").map((a) => a.trim()),
        search_tags: form.search_tags.split(",").map((a) => a.trim()),
        starting_price: parseFloat(form.starting_price),
      });
      serviceUpdateMsg();
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Failed to save:", error);
      errorMsg();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <HashLoader color="#D39D55" />  
    </div>
  );
  if (!data) return <p>Service not found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold mb-8">Edit Listed Services</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium mb-1">
            Service Title
          </label>
          <input
            name="service_title"
            className="w-full border rounded px-3 py-2"
            value={form.service_title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Starting Price (LKR)
          </label>
          <input
            name="starting_price"
            type="number"
            className="w-full border rounded px-3 py-2"
            value={form.starting_price}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Servicable Areas
          </label>
          <input
            name="servicable_areas"
            className="w-full border rounded px-3 py-2"
            value={form.servicable_areas}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notice / Lead Period
          </label>
          <input
            name="notice_period"
            className="w-full border rounded px-3 py-2"
            value={form.notice_period}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Discounts and Offers
          </label>
          <textarea
            name="discounts_and_offers"
            className="w-full border rounded px-3 py-2"
            rows={2}
            value={form.discounts_and_offers}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Cancellation & Refund Policy
          </label>
          <textarea
            name="cancellation_policy"
            className="w-full border rounded px-3 py-2"
            rows={2}
            value={form.policies}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Other Details
          </label>
          <textarea
            name="other_details"
            className="w-full border rounded px-3 py-2"
            rows={2}
            value={form.other_details}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Search Tags</label>
          <input
            name="search_tags"
            className="w-full border rounded px-3 py-2"
            value={form.search_tags}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Price Features
          </label>
          <textarea
            name="price_features"
            className="w-full border rounded px-3 py-2"
            rows={2}
            value={form.price_features}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Service Description
          </label>
          <textarea
            name="service_description"
            className="w-full border rounded px-3 py-2"
            rows={4}
            value={form.service_description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-[#FF9F29] font-semibold text-base">
        <TriangleAlert className="w-4 h-4" />
        Note:
      </div>
      <p className="text-sm font-semibold mt-[-20] text-gray-600">
        To update serviceable areas, tags, or price features, edit the text and
        separate each item with a comma. To remove an item, delete it along with
        its comma and click save button to apply changes.
      </p>

      <div className="flex gap-4 mt-6">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
      </div>
    </div>
  );
}
