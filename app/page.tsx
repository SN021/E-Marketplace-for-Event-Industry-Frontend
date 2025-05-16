import React from "react";
import Navbar from "./_sections/_components/Navbar";
import Hero from "./_sections/hero";
import FeatureSection from "./_sections/features";
import HowItWorks from "./_sections/howItWorks";

export default function Home() {
	return (
		<div className="min-h-screen">
			<Navbar />
			<main>
				<Hero />
				<FeatureSection />
				<HowItWorks />
			</main>
		</div>
	);
}
