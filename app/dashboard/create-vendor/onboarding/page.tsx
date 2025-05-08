import { Button } from "@/components/ui/button";
import { link } from "fs";
import { Check } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background">
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((step, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                step <= 4 ? "bg-primary" : "bg-gray-300"
              }`}
            >
              {step}
            </div>
            {index < 3 && <div className="w-12 h-1 bg-primary" />}
          </div>
        ))}
      </div>

      <div className="bg-primary rounded-full p-6 mb-6">
        <Check className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold text-center text-[#1A1443] mb-4">
        Your Vendor Application Has Been Submitted!
      </h1>
      <p className="text-center text-gray-600 max-w-md">
        Thank you for joining us as{" "}
        <span className="font-medium">a amazing vendor</span>. Your application
        is currently under review by our admin team. Once approved, your vendor
        profile will go live on the platform. Meanwhile, you can start building
        your service listings and setting up your dashboard.
      </p>

      <Link href="/dashboard">
        <Button className="mt-10">Back</Button>
      </Link>
    </div>
  );
};

export default page;
