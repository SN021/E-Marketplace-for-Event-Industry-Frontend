"use client";

import { Handshake, MessageSquare, ShieldCheck, Users } from "lucide-react";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type Props = {};

function FeatureSection({}: Props) {
	return (
		<section className="bg-[#222629] py-20 px-6 md:px-16 h-screen flex flex-col gap-12 items-center justify-center mt-28">
			<h2 className="text-4xl md:text-5xl font-bold text-white mb-10">
				PLATFORM <span className="text-primary">FEATURES</span>
			</h2>
			<div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
				<div className="flex justify-center " data-aos="fade-right">
					<DotLottieReact
						src="https://lottie.host/0598d616-e4b9-4389-966c-e253800e0da8/5Z4iVBkhow.lottie"
						loop
						autoplay
					/>
				</div>

				<div data-aos="fade-left">
					<div className="space-y-8 text-gray-300">
						<div className="flex items-start gap-4">
							<Handshake className="text-primary w-10 h-10 mt-1" />
							<div>
								<h4 className="font-semibold text-white mb-1">
									Instant Vendor Matchmaking
								</h4>
								<p className="text-sm">
									Quickly find the best vendors tailored to your budget,
									location, preferences, and reviews through advanced browsing and filtering.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<MessageSquare className="text-primary w-10 h-10 mt-1" />
							<div>
								<h4 className="font-semibold text-white mb-1">
									Real-Time Communication & Instant Booking
								</h4>
								<p className="text-sm">
									Seamlessly chat, call, or video consult with vendors directly
									through our platform. Get instant responses and finalize
									bookings effortlessly.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<Users className="text-primary w-10 h-10 mt-1" />
							<div>
								<h4 className="font-semibold text-white mb-1">
									Vendor Community Hub & Knowledge Sharing
								</h4>
								<p className="text-sm">
									Vendors can join a collaborative space to share ideas, gain
									mentorship, access exclusive resources, and grow their
									businesses together.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<ShieldCheck className="text-primary w-10 h-10 mt-1" />
							<div>
								<h4 className="font-semibold text-white mb-1">
									Secure Payments & Guaranteed Service
								</h4>
								<p className="text-sm">
									Enjoy safe and transparent transactions. Funds are held
									securely until your event is successfully delivered, with
									refund options and dispute resolution support.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default FeatureSection;
