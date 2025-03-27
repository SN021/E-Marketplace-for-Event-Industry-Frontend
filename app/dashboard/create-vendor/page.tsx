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
                <label>Username</label>
                <input
                  type="text"
                  id="user name"
                  placeholder="Enter your username"
                  className=" p-2 border border-black rounded-sm "
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Display Name</label>
                <input
                  type="text"
                  id="display name"
                  placeholder="Enter your preferred name to display"
                  className=" p-2 border border-black rounded-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  className=" p-2 border border-black rounded-sm "
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>About</label>
                <textarea
                  placeholder="Enter a brief description about the vendor and what he does"
                  className=" h-30 p-2 border border-black rounded-sm "
                  id="description"
                  required
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label className=" mb-2">Profile Picture</label>
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
                  id="business name"
                  placeholder="Enter your business name"
                  className=" p-2 border border-black rounded-sm "
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Business Registration Number(BRN)(optional)</label>
                <input
                  type="text"
                  id="BRN"
                  placeholder="BRxxxxxxxxx"
                  className=" p-2 border border-black rounded-sm"
                />
              </div>

              <div className="flex flex-col">
                <label>Business Address</label>
                <input
                  type="text"
                  id="business address"
                  placeholder="Enter your business address"
                  className=" p-2 border border-black rounded-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="experience-level">Experience Level</label>
                <select
                  id="experience-level"
                  className="p-2 border border-black rounded-sm"
                  defaultValue="value-experience"
                  required
                >
                  <option value="value-experience" disabled hidden>
                    Select your experience level
                  </option>
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label>Website or portfolio link</label>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  placeholder="https://yourportfolio.com"
                  className="p-2 border border-black rounded-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="province">Province</label>
                <select
                  id="province"
                  className=" p-2 border border-black rounded-sm "
                  defaultValue="value-province"
                  required
                >
                  <option value="value-province" disabled hidden>
                    Select your province
                  </option>
                  <option value="Islandwide">Islandwide</option>
                  <option value="Central">Central</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Northern">Northern</option>
                  <option value="North Central">North Central</option>
                  <option value="North Western">North Western</option>
                  <option value="Sabaragamuwa">Sabaragamuwa</option>
                  <option value="Southern">Southern</option>
                  <option value="Uva">Uva</option>
                  <option value="Western">Western</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  className=" p-2 border border-black rounded-sm "
                  defaultValue="value-city"
                  required
                >
                  <option value="value-city" disabled hidden>
                    Select your city
                  </option>
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kalutara">Kalutara</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Matale">Matale</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Galle">Galle</option>
                  <option value="Matara">Matara</option>
                  <option value="Hambantota">Hambantota</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Mannar">Mannar</option>
                  <option value="Vavuniya">Vavuniya</option>
                  <option value="Mullaitivu">Mullaitivu</option>
                  <option value="Kilinochchi">Kilinochchi</option>
                  <option value="Batticaloa">Batticaloa</option>
                  <option value="Ampara">Ampara</option>
                  <option value="Trincomalee">Trincomalee</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Puttalam">Puttalam</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Polonnaruwa">Polonnaruwa</option>
                  <option value="Badulla">Badulla</option>
                  <option value="Monaragala">Monaragala</option>
                  <option value="Ratnapura">Ratnapura</option>
                  <option value="Kegalle">Kegalle</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label>Business Email Address</label>
                <input
                  type="email"
                  id="business email address"
                  placeholder="Enter your business email address"
                  className=" p-2 border border-black rounded-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Business Phone Number</label>
                <input
                  type="tel"
                  id="business phone number"
                  pattern="[0-9]{10}"
                  placeholder="Enter your business phone number"
                  className=" p-2 border border-black rounded-sm"
                  required
                />
              </div>
            </form>
          </div>
          <button className="bg-primary ml-0 md:ml-6 px-4 py-2 rounded-[10px] font-semibold text-white duration-300 w-[100px] mt-10 absolute right-3 ">
            Next
          </button>
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
