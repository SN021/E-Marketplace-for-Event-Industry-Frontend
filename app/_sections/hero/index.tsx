import React from "react";
import HeroImageScroller from "../_components/HeroImageScroller";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

function Hero() {
	return (
		<section className="bg-background h-[calc(100vh-104px)] flex items-center pt-26">
			<div className="w-full max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 h-full">
				<div className="md:col-span-2 flex flex-col justify-center gap-5">
					<div>
						<div className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight flex flex-col items-center justify-center md:items-start">
							<PointerHighlight
								rectangleClassName="bg-neutral-200/20 dark:bg-neutral-700/20"
								pointerClassName="text-yellow-500"
							>
								<div className="flex items-center md:justify-normal justify-center font-bold text-primary tracking-wider p-1">
									<span className="inline-block md:w-20 md:h-20 w-15 h-15 bg-primary text-white font-extrabold text-center rounded-sm mr-1">
										V
									</span>
									ENZOR
								</div>
							</PointerHighlight>
							<span className="text-5xl md:text-6xl text-center md:text-left">
								Find Trusted Event Vendors. <br /> All in One Place.
							</span>
						</div>
						<p className="text-gray-600 mb-6 max-w-md text-lg mx-auto md:mx-0 text-center md:text-left">
							Book best vendors for all your events online. Get the best deals
							and services.
						</p>
					</div>
					<Link href="/dashboard" className="flex justify-center md:justify-start">
						<Button className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-md font-medium transition">
							Get Started
						</Button>
					</Link>
				</div>
				<div className="hidden md:block">
					<HeroImageScroller />
				</div>
			</div>
		</section>
	);
}

export default Hero;
