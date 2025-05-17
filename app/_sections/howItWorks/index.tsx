"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
	const [activeTab, setActiveTab] = useState<"customer" | "vendor">("customer");

	const steps = {
		customer: [
			["Sign Up", "Create a free account in just a few clicks."],
			[
				"Browse Vendors",
				"Explore our network of trusted vendors in your desired category.",
			],
			[
				"Request a Proposal or In-Site Call",
				"Connect with vendors for custom proposals or calls.",
			],
			[
				"Book the Service",
				"Finalize your booking after reviewing the proposal.",
			],
			["Enjoy & Review", "Experience the service and share your feedback."],
		],
		vendor: [
			["Register Your Business", "Create a profile and list your services."],
			["Get Discovered", "Appear in searches and attract potential customers."],
			["Engage with Customers", "Reply to quotes and schedule in-site calls."],
			["Earn & Grow", "Deliver services, get paid, and expand your reach."],
			["Enjoy & Review", "Get reviews and build your vendor reputation."],
		],
	};

	return (
		<section className="py-20 bg-background text-center h-screen flex flex-col items-center justify-center">
			<h2 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-10">
				HOW IT <span className="text-primary">WORKS</span>?
			</h2>

			<div className="flex justify-center gap-4 mb-10">
				<Button
					onClick={() => setActiveTab("customer")}
					className={`px-5 py-2 rounded-full font-medium ${
						activeTab === "customer"
							? "bg-primary text-white"
							: "bg-gray-200 text-gray-700"
					}`}
				>
					For Customers
				</Button>
				<Button
					onClick={() => setActiveTab("vendor")}
					className={`px-5 py-2 rounded-full font-medium ${
						activeTab === "vendor"
							? "bg-primary text-white"
							: "bg-gray-200 text-gray-700"
					}`}
				>
					For Vendors
				</Button>
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto px-4"
				>
					{steps[activeTab].map(([title, desc], index) => (
						<div key={index} className="text-center space-y-2">
							<div className="flex justify-center">
								<div className="w-12 h-12 flex items-center justify-center rounded-md bg-primary text-white font-bold text-lg">
									{index + 1}
								</div>
							</div>
							<h4 className="font-semibold text-lg text-gray-800 text-center">{title}</h4>
							<p className="text-sm text-gray-600 text-center">{desc}</p>
						</div>
					))}
				</motion.div>
			</AnimatePresence>
		</section>
	);
}
