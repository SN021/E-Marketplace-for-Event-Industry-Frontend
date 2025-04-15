type GigCardProps = {
  title: string;
  seller: string;
  price: string;
  imageUrl: string;
};

export const GigCard = ({ title, seller, price, imageUrl }: GigCardProps) => {
  return (
    <div className="w-[250px] bg-white rounded-lg shadow-sm p-4">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-[160px] object-cover rounded"
      />
      <h3 className="text-sm font-semibold mt-3">{title}</h3>
      <p className="text-xs text-gray-500">by {seller}</p>
      <p className="mt-2 text-yellow-600 font-semibold text-sm">
        Starts at {price}
      </p>
    </div>
  );
};
