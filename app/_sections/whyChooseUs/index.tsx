import React from "react";
import {
	ShieldCheck,
	Sparkles,
	LayoutGrid,
	Users,
	Star,
	Wand2,
	TrendingUp,
	SlidersHorizontal,
} from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type Props = {};

const features = [
	{
		title: "Effortless & Time-Saving",
		description: "Quick & Simple - Get What You Need, Fast!",
		icon: Sparkles,
	},
	{
		title: "Easy-to-Use Platform",
		description: "Seamless & Simple - Get Started in Seconds!",
		icon: Wand2,
	},
	{
		title: "Wide Range of Services",
		description: "One Platform, Endless Possibilities!",
		icon: LayoutGrid,
	},
	{
		title: "Verified & Trusted Vendors",
		description: "Quality You Can Rely On!",
		icon: ShieldCheck,
	},
	{
		title: "Customer Ratings & Reviews",
		description: "Real Feedback, Real Trust!",
		icon: Star,
	},
	{
		title: "Smart Matching & Recommendations",
		description: "Perfect Matches - Every Time, Every Need!",
		icon: SlidersHorizontal,
	},
	{
		title: "Growth & Business Expansion",
		description: "Boost Your Reach - Unlock New Opportunities!",
		icon: TrendingUp,
	},
	{
		title: "Customisation Solutions",
		description: "Personalised For You - Tailored to Fit Your Needs!",
		icon: Users,
	},
];

function WhyChooseUs({}: Props) {
	return (
		<section className="py-24 bg-[#222629] text-white text-center ">
			<div className="max-w-6xl mx-auto px-4 w-full pt-20">
				<h2 className="text-4xl md:text-5xl font-bold text-white mb-20">
					WHY <span className="text-primary">TRUST</span> OUR PLATFORM?
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{features.map(({ title, description, icon: Icon }, index) => {
						// Check if it's one of the last two cards
						const isLastRowCenter = index === 6 || index === 7;

						return (
							<CardContainer
								key={index}
								className={`w-full ${
									isLastRowCenter ? "md:col-span-1 md:col-start-2" : ""
								}`}
								containerClassName="w-full h-full"
							>
								<CardBody className="bg-background rounded-lg border border-gray-200 shadow-md h-full min-h-[220px] p-6 flex flex-col justify-between text-center">
									<CardItem
										as="div"
										translateZ={20}
										rotateX={2}
										rotateY={-2}
										className="flex flex-col items-center"
									>
										<Icon className="h-8 w-8 text-primary mb-4" />
										<h3 className="font-semibold text-lg mb-2 text-zinc-800">
											{title}
										</h3>
										<p className="text-sm text-zinc-600">{description}</p>
									</CardItem>
								</CardBody>
							</CardContainer>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default WhyChooseUs;
