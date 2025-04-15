import { GigCard } from "./GigCard";

const dummyData = [
  {
    title: "Wedding Coordination Services",
    seller: "ce_creative",
    price: "Rs. 8,674",
    imageUrl: "/dummy-1.jpg",
  },
  {
    title: "Social Media Event Branding",
    seller: "mukarramhussain09",
    price: "Rs. 868",
    imageUrl: "/dummy-2.jpg",
  },
  {
    title: "Website Design in Figma",
    seller: "creativesmith89",
    price: "Rs. 6,072",
    imageUrl: "/dummy-3.jpg",
  },
];

type GigCarouselProps = {
  title: string;
};

export const GigCarousel = ({ title }: GigCarouselProps) => {
  return (
    <section className="my-10">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {dummyData.map((gig, idx) => (
          <GigCard key={idx} {...gig} />
        ))}
      </div>
    </section>
  );
};
