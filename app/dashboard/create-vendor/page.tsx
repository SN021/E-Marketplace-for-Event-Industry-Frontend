import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { Pencil } from "lucide-react";

const page = () => {
  const data = [
    {
      title: "Step 01: Basic Information",
      content: (
        <div>
          <div className="bg-amber-200 flex-col flex box items-center justify-center rounded-[40px] px-15 py-10 md:px-28 lg:px-32">
            <form action="Post" className="flex flex-col gap-5 w-full">
              <div className=" flex flex-col ">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className=" p-2 border border-black rounded-sm "
                />
              </div>

              <div className="flex flex-col">
                <label>Display Name</label>
                <input
                  type="text"
                  placeholder="Enter your preferred display name"
                  className=" p-2 border border-black rounded-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className=" p-2 border border-black rounded-sm "
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>About</label>
                <textarea
                  placeholder="Enter a brief description about the vendor and what he does"
                  className=" h-30 p-2 border border-black rounded-sm "
                  required
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">
                  Profile Picture
                </label>
                <div className="relative w-32 h-32">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400">Image</span>
                  </div>
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </label>
                  <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    className="hidden"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      ),
    },
    {
      title: "Step 02: Business Details",
      content: (
        <div>
          <div className="bg-amber-200 flex-col flex box items-center justify-center rounded-[40px] px-15 py-10 md:px-32 lg:px-48">
            <form action="Post" className="flex flex-col gap-5 w-full">
              <div className=" flex flex-col">
                <label>Business Name</label>
                <input
                  type="text"
                  placeholder="Enter your business name"
                  className=" p-2 border border-black rounded-sm "
                />
              </div>

              <div className="flex flex-col">
                <label>Business Registration Number(BRN)(optional)</label>
                <input
                  type="text"
                  placeholder="BRxxxxxxxxx"
                  className=" p-2 border border-black rounded-sm"
                />
              </div>

              <div className="flex flex-col">
                <label>Business Address</label>
                <input
                  type="text"
                  placeholder="Enter your business address"
                  className=" p-2 border border-black rounded-sm"
                />
              </div>

              <div className="flex flex-col">
                <label>Service Category</label>
                <input
                  type="email"
                  placeholder="Select Options"
                  className=" p-2 border border-black rounded-sm "
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Event Type</label>
                <input
                  type="email"
                  placeholder="Select Options"
                  className=" p-2 border border-black rounded-sm "
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Experience Level</label>
                <input
                  type="drop "
                  placeholder="Select Options"
                  className=" p-2 border border-black rounded-sm "
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Website or Portfolio link</label>
                <input
                  type="text"
                  placeholder="Paste URL"
                  className=" p-2 border border-black rounded-sm"
                />
              </div>

              <div className="flex flex-col">
                <label>Province</label>
                <input
                  type="text"
                  placeholder="Enter your province"
                  className=" p-2 border border-black rounded-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>City</label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  className=" p-2 border border-black rounded-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Business Email</label>
                <input
                  type="text"
                  placeholder="Enter your business email"
                  className=" p-2 border border-black rounded-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Business Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter your business phone number"
                  className=" p-2 border border-black rounded-sm"
                  required
                />
              </div>
            </form>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="w-full -mt-10 md:-mt-20">
        <Timeline data={data} />
      </div>
      
    </div>
  );
};

export default page;
