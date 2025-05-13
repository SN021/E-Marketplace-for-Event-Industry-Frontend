import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <SignedIn>
          <UserButton/>
        </SignedIn>
        <SignedOut>
          <SignInButton/>
          <SignUpButton/>
        </SignedOut>
      </div>
      <div>
        <div className="font-sans bg-white text-black">
      {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-6 px-8 py-12 bg-neutral-50">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Find Best Vendors For Your All Events, Online
            </h1>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus imperdiet sed id elementum.
            </p>
            <Button className="bg-amber-500 text-white w-fit">Get Started</Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={`https://source.unsplash.com/random/200x200?sig=${i}&event`}
                  alt="vendor"
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-black text-white py-12 px-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            PLATFORM <span className="text-amber-400">FEATURES</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              ["Instant Vendor Matchmaking", "Quickly find the best vendors tailored to your event type."],
              ["Real-Time Communication & Instant Booking", "Chat or video consult with vendors directly on-platform."],
              ["Vendor Community Hub & Knowledge Sharing", "Collaborate and grow with like-minded professionals."],
              ["Secure Payments & Guaranteed Service", "Safe, transparent transactions and delivery assurance."],
            ].map(([title, desc], i) => (
              <div key={i} className="flex gap-4">
                <div className="w-4 h-4 mt-1 bg-amber-400"></div>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-gray-300">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-16 px-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            HOW IT <span className="text-amber-500">WORKS</span>?
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-center">
            {["Sign Up", "Browse Vendors", "Request a Proposal or In-Site Call", "Book the Service", "Enjoy & Review"].map((step, i) => (
              <div key={i} className="flex-1">
                <div className="text-5xl text-amber-500 font-bold mb-2">{i + 1}</div>
                <h4 className="font-semibold mb-2">{step}</h4>
                <p className="text-sm text-gray-600">{i === 0 ? "Create a free account in just a few clicks" : i === 1 ? "Explore our network of trusted vendors" : i === 2 ? "Connect with vendors or request proposals" : i === 3 ? "Finalize your booking" : "Experience and review the service"}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Trust Us */}
        <section className="bg-black text-white py-16 px-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            WHY <span className="text-amber-400">TRUST</span> OUR PLATFORM?
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center max-w-5xl mx-auto">
            {["Effortless & Time-Saving", "Easy-to-Use Platform", "Wide Range of Services", "Verified & Trusted Vendors", "Customer Ratings & Reviews", "Smart Matching & Recommendations", "Growth & Business Expansion", "Customisation Solutions"].map((label, i) => (
              <div key={i} className="bg-neutral-800 p-4 rounded-lg shadow-md">
                <div className="text-xl font-semibold mb-2">{label}</div>
                <p className="text-sm text-gray-400">Lorem ipsum dolor sit amet consectetur.</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-neutral-50 py-16 px-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            DISCOVER VENDOR <span className="text-amber-500">CATEGORIES</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {["Event Planners", "Caterers", "Photographers", "Florists", "Musicians", "Makeup Artists", "Graphic Designers", "Corporate Organisers"].map((cat, i) => (
              <div key={i} className="overflow-hidden rounded-lg shadow">
                <img
                  src={`https://source.unsplash.com/random/300x200?sig=${i}&event`}
                  alt={cat}
                  className="w-full h-40 object-cover"
                />
                <div className="bg-white text-center p-2 font-medium">{cat}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button className="bg-amber-500 text-white">Explore More</Button>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-black text-white text-center py-16 px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            THE FASTEST WAY FROM IDEA TO LIVE SITE. PERIOD.
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Flex is a Small SaaS Business. Flex isn’t a traditional company.
          </p>
          <Button className="bg-amber-500 text-white">Get Started</Button>
        </section>
    </div>

      </div>
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
    </div>




  );
}
