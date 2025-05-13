"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HashLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import { convertLKRtoUSD } from "@/lib/utils/currency-converter";
import { useAnalytics } from '@/lib/hooks/useAnalytics';

type Offer = {
  id: string;
  description: string | null;
  price: number;
  status: "sent" | "accepted" | "declined";
  created_at: string;
  expires_at: string | null;
  payment_status: "pending" | "paid" | "failed" | null;
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
  payment?: Array<{
    status: "pending" | "paid" | "failed";
  }>;
};

const statusStyles: Record<Offer["status"], string> = {
  sent: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

export default function VendorOffers() {
  const { user } = useUser();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [usdRates, setUsdRates] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logAnalytics } = useAnalytics();

  const fetchOffers = async () => {
    try {
      const res = await axios.get("/api/offers/get?page=1&include_payment=true");
      
      
      const offersWithPaymentStatus = res.data.offers.map((offer: Offer) => {
        // Detailed logging for payment information
        console.log(`Offer ${offer.id} raw payment data:`, offer.payment);
        
        const paymentStatus = offer.payment && offer.payment.length > 0 
          ? offer.payment[0].status 
          : null;
        
        console.log(`Offer ${offer.id} extracted payment status:`, paymentStatus);
        
        return {
          ...offer,
          payment_status: paymentStatus
        };
      });
      
      console.log('Processed offers with payment status:', offersWithPaymentStatus);
      setOffers(offersWithPaymentStatus);
    } catch (err) {
      console.error("Failed to fetch offers", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUSDRates = async () => {
      if (offers.length > 0) {
        const ratesPromises = offers.map(async (offer) => {
          try {
            const conversion = await convertLKRtoUSD();
            const usdAmount = (offer.price * conversion).toFixed(2);
            return { [offer.id]: usdAmount };
          } catch (error) {
            console.error(`Failed to convert price for offer ${offer.id}`, error);
            return { [offer.id]: '0.00' };
          }
        });

        const ratesResults = await Promise.all(ratesPromises);
        const ratesMap = ratesResults.reduce((acc, curr) => ({
          ...acc,
          ...Object.fromEntries(
            Object.entries(curr).filter(([, value]) => value !== null)
          )
        }), {});
        setUsdRates(ratesMap);
      }
    };

    fetchUSDRates();
  }, [offers]);

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
              <div className="space-y-1">
                <div className="flex items-center">
                  <strong>Price:</strong>
                  <span className="ml-2">
                    LKR {offer.price.toFixed(2)} 
                    {usdRates[offer.id] && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({usdRates[offer.id]} USD)
                      </span>
                    )}
                  </span>
                </div>
                {offer.payment_status && (
                  <div className="mt-1">
                    <strong>Payment Status:</strong>{" "}
                    <Badge
                      variant={offer.payment_status === 'paid' ? 'default' : 
                               offer.payment_status === 'failed' ? 'destructive' : 'secondary'}
                    >
                      {offer.payment_status.charAt(0).toUpperCase() + offer.payment_status.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
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