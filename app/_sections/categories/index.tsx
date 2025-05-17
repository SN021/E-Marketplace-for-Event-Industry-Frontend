"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { eventServiceCategories } from "@/data/categoriesWithsubcategories";
type Props = {};

const Categories = (props: Props) => {
	const allSubcategories = useMemo(() => {
		return eventServiceCategories.flatMap((category) =>
			category.subcategories.map((sub) => ({
				...sub,
				parentLabel: category.label,
			}))
		);
	}, []);

	const [visibleCount, setVisibleCount] = useState(8); // 2 rows max initially

	const handleToggle = () => {
		setVisibleCount((prev) => (prev === 8 ? allSubcategories.length : 8));
	};

	return (
		<section className="py-24 bg-[#fefaf4] text-center">
			<div className="max-w-6xl mx-auto px-4">
				<h2 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-12">
					DISCOVER VENDOR <span className="text-primary">CATEGORIES</span>
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
					{allSubcategories.slice(0, visibleCount).map((sub, idx) => (
						<div
							key={sub.value}
							className="relative overflow-hidden rounded-lg shadow group h-[180px] cursor-pointer"
						>
							<Link href={`/dashboard/search?subcategory=${sub.value}`}>
								<Image
									src={"/images/heroimage03.jpg"}
									alt={sub.label}
									fill
									className="object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center px-2">
									<h3 className="text-white font-semibold text-lg md:text-xl text-center">
										{sub.label}
									</h3>
									<p className="text-xs text-white/70 mt-1">
										{sub.parentLabel}
									</p>
								</div>
							</Link>
						</div>
					))}
				</div>

				<button
					onClick={handleToggle}
					className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 transition"
				>
					{visibleCount === 8 ? "Explore More" : "Show Less"}
				</button>
			</div>
		</section>
	);
};

export default Categories;
