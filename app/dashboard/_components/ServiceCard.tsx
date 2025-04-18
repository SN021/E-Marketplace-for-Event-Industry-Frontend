import { Star, CheckCircle, Heart } from "lucide-react";
import Link from "next/link";

type ServiceCardProps = {
  title: string;
  seller: string;
  price: string;
  imageUrl: string;
  rating?: number;
  verified?: boolean;
};

export const ServiceCard = ({
  title,
  seller,
  price,
  imageUrl,
  rating = 4.5,
  verified = true,
}: ServiceCardProps) => {
  console.log(imageUrl);
  return (
    <div className=" bg-white rounded-lg shadow-sm p-4 relative">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-[160px] object-cover rounded"/>

      <Heart className="absolute top-3 right-3 text-gray-400 hover:text-red-500 w-5 h-5 cursor-pointer" />
      <h3 className="text-sm font-semibold mt-3">{title}</h3>
      <p className="text-xs text-gray-500 flex items-center gap-1">by {seller}{verified && <CheckCircle className="w-4 h-4 text-green-600" />} </p>
      <div className="flex items-center gap-1 mt-1">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="text-xs font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
      <p className="mt-2 text-yellow-600 font-semibold text-sm">
        Starts at Rs.{price}
      </p>
    </div>
  );
};
