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
        Vendor Account Has Successfully Created
      </h1>
      <p className="text-center text-gray-500 max-w-md">
        You're all set to be{" "}
        <span className="font-medium">an amazing vendor</span>! Your account has
        successfully created. Let's create your service list and get started.
      </p>

      <Link href="/dashboard/create-service">
        <Button className="mt-10">Create Your First Service</Button>
      </Link>
      <Link href="/dashboard/vendor-dashboard">
        <Button 
        variant="link"
        className="text-gray-500 mt-4"> Skip</Button>
      </Link>
    </div>
  );
}

export default page
