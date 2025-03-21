import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { Pencil } from "lucide-react";

const page = () => {
  const data = [
    {
      title: "Step 01",
      content: <div></div>,
    },
    {
      title: "Step 02",
      content: <div></div>,
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="w-full -mt-10 md:-mt-20">
        <Timeline data={data} />
      </div>
      <div className="bg-amber-200 h-120 w-200 flex flex-col">
        <form action="Post" className="">
          <div className="flex flex-col">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-100 p-2 border border-black rounded-b-sm "
            />
          </div>

          <div className="flex flex-col">
            <label>Display Name</label>
            <input
              type="text"
              placeholder="Enter your preferred display name"
              className="w-100 p-2 border border-black rounded-b-sm"
            />
          </div>

          <div className="flex flex-col">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-100 p-2 border border-black rounded-b-sm "
            />
          </div>

          <div className="flex flex-col">
            <label>About</label>
            <textarea
              placeholder="Enter a brief description about the vendor and what he does"
              className="w-100 p-2 border border-black rounded-b-sm "
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2">Profile Picture</label>
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
