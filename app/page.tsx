import React from "react";
import Navbar from "./_sections/_components/Navbar";
import Hero from "./_sections/hero";
import FeatureSection from "./_sections/features";
import HowItWorks from "./_sections/howItWorks";
import WhyChooseUs from "./_sections/whyChooseUs";
import Categories from "./_sections/categories";
import FooterLanding from "./_sections/_components/Footer";

export default function Home() {
	return (
		<div className="min-h-screen">
			<Navbar />
			<main>
				<Hero />
				<FeatureSection />
				<HowItWorks />
				<WhyChooseUs />
				<Categories />
			</main>
			<FooterLanding />
		</div>
	);
}
