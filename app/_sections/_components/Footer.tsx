import Footer from "@/app/dashboard/_components/Footer";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import React from "react";

type Props = {};

function FooterLanding({}: Props) {
	return (
		<section className="bg-[#222629] text-white relative overflow-hidden z-10">
			{/* Hero CTA */}
			<div className="text-center py-24 px-4 max-w-3xl mx-auto z-20">
				<h2 className="text-4xl md:text-5xl font-bold mb-4">
					THE FASTEST WAY FROM IDEA TO LIVE SITE. PERIOD.
				</h2>
				<p className="text-gray-400 text-lg mb-6">
					Flex is a Small SaaS Business. Flex isn't a traditional company.
				</p>
				<Button className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 transition">
					Get Started
				</Button>
			</div>

			{/* Footer with glow above */}
			<div className="relative mt-16 z-10">
				{/* Glow strip */}
				<div className="absolute -top-3 left-0 w-full h-15 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-md" />

				{/* Your footer component */}
				<Footer />
			</div>
		</section>
	);
}

export default FooterLanding;
