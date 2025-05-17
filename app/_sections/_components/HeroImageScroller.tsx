"use client";

import Image from "next/image";

const images = [
	"/images/hero/1.jpg",
	"/images/hero/2.jpg",
	"/images/hero/3.jpg",
	"/images/hero/4.jpg",
	"/images/hero/5.jpg",
	"/images/hero/6.jpg",
];

export default function HeroImageScroller() {
	return (
		<div className="relative h-full">
			<div className="absolute inset-0 flex gap-4 overflow-hidden">
				<div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
				<div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

				<div className="relative h-screen w-full flex items-center justify-center">
					<div className="flex gap-4 overflow-hidden">
						{/* Left column - scrolls up */}
						<div className="flex flex-col gap-4 animate-scroll-up">
							{images.concat(images).map((img, index) => (
								<div
									key={`col1-${index}`}
									className="relative w-[200px] h-[250px] rounded-xl overflow-hidden"
								>
									<Image src={img} alt="" fill className="object-cover" />
								</div>
							))}
						</div>

						{/* Right column - scrolls down */}
						<div className="flex flex-col gap-4 animate-scroll-down">
							{images.concat(images).map((img, index) => (
								<div
									key={`col2-${index}`}
									className="relative w-[200px] h-[250px] rounded-xl overflow-hidden"
								>
									<Image src={img} alt="" fill className="object-cover" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
