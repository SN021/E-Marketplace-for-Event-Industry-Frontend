"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HashLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";

type Offer = {
  id: string;
  description: string | null;
  price: number;
  status: "sent" | "accepted" | "declined";
  created_at: string;
  expires_at: string | null;
  conversation: {
    client: {
      first_name: string | null;
      last_name: string | null;
      email: string;
      username: string;
    };
    service: {
      service_title: string;
    };
  };
};

const statusStyles: Record<Offer["status"], string> = {
  sent: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

export default function ViewOffers() {
  const { user } = useUser();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const res = await axios.get("/api/offers/get?page=1");
      setOffers(res.data.offers);
    } catch (err) {
      console.error("Failed to fetch offers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchOffers();
  }, [user?.id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <HashLoader color="#D39D55" />
      </div>
    );

  if (offers.length === 0)
    return <p className="text-sm text-muted-foreground">No offers sent yet.</p>;

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <Card key={offer.id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {offer.description || "_No description provided._"}
                  </ReactMarkdown>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Service:</strong>{" "}
                  {offer.conversation.service.service_title}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Client:</strong>{" "}
                  {offer.conversation.client.first_name
                    ? `${offer.conversation.client.first_name} ${offer.conversation.client.last_name}`
                    : offer.conversation.client.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {offer.conversation.client.email}
                </p>
              </div>

              <Badge className={statusStyles[offer.status]}>
                {offer.status}
              </Badge>
            </div>

            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <p>
                <strong>Price:</strong> Rs. {offer.price.toFixed(2)}
              </p>
              <p>
                <strong>Sent:</strong>{" "}
                {format(new Date(offer.created_at), "PPpp")}
              </p>
              {offer.expires_at && (
                <p>
                  <strong>Expires:</strong>{" "}
                  {format(new Date(offer.expires_at), "PPpp")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
