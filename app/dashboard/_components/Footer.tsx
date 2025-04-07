import React from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-[#222629] text-white  pt-16">
      <div className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-12">
        <div>
          <div className="text-3xl font-bold text-primary tracking-wider mb-4">
            <span className="inline-block w-9 h-9 bg-primary text-white font-extrabold text-center rounded-sm mr-1">
              V
            </span>
            ENZOR
          </div>
          <p className="text-sm mb-4">Subscribe to our newsletter</p>
          <form className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="Email address"
              className="bg-transparent border border-gray-600 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary px-4 py-2 rounded-md"
            >
              <Mail className="w-4 h-4" />
            </Button>
          </form>
        </div>

        <div>
          <h4 className="text-primary font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href=" " className="hover:underline">
                User Dashboard
              </a>
            </li>
            <li>
              <a href=" " className="hover:underline">
                Community Hub
              </a>
            </li>
            <li>
              <a href=" " className="hover:underline">
                Become Vendor
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-primary font-semibold mb-4">Home</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href=" " className="hover:underline">
                How It Works
              </a>
            </li>
            <li>
              <a href=" " className="hover:underline">
                About Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-primary font-semibold mb-4">Help</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href=" " className="hover:underline">
                FAQs
              </a>
            </li>
            <li>
              <a href=" " className="hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-between text-xs text-white">
        <div className=" w-[500px]  h-10 bg-primary rounded-tr-[3rem]" />
        <p className="text-center pt-3">&copy; 2025 Venzor. All rights reserved.</p>

        <div className=" w-[500px]  h-10 bg-primary rounded-tl-[3rem]" />
      </div>
    </footer>
  );
};

export default Footer;
