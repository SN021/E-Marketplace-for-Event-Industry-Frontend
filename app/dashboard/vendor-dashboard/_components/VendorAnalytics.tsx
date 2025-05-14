"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HashLoader } from "react-spinners";

type ServiceData = {
  service_id: string;
  service_title: string;
  display_name: string;
  starting_price: number;
  photo_gallery: string[];
  averageRating: number;
  price_features: string[];
  tags: string[];
  service_description: string;
  cancellation_policy: string;
  servicable_areas: string;
  notice_period: string;
  other_details: string;
  discounts_and_offers: string;
};

type AnalyticsData = {
  metric_type: string;
  service_id: string;
  service_title: string;
  total_count: number;
};

type OfferChartData = { date: string; count: number };

// Define the Offer type to solve the 'any' type issues
type Offer = {
  id: string;
  price: number;
  description: string;
  status: string;
  created_at: string;
  expires_at: string;
  payment?: {
    status: string;
  };
  conversation?: {
    service?: {
      service_title: string;
    };
    client?: {
      first_name: string;
      email: string;
    };
  };
};

export default function VendorAnalytics() {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [chartData, setChartData] = useState<OfferChartData[]>([]);
  const [viewMode, setViewMode] = useState<"detailed" | "chart">("detailed");
  const [loading, setLoading] = useState(true);
  const [loadingService, setLoadingService] = useState(false);
  const [offersLoading, setOffersLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [offerStats, setOfferStats] = useState({ total: 0, accepted: 0, declined: 0 });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const { data: analyticsResponse } = await axios.get("/api/analytics?timeframe=last_30_days");
        setAnalytics(analyticsResponse.analytics ?? []);
      } catch (err) {
        console.error("Failed to load analytics", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const loadServiceDetails = async (serviceId: string) => {
    setLoadingService(true);
    setOffersLoading(true);
    try {
      const [{ data: serviceData }, { data: offerRes }] = await Promise.all([
        axios.get(`/api/services/get-service-by-id?id=${serviceId}`),
        axios.get(`/api/offers/get?page=1&include_payment=true`)
      ]);

      setSelectedService(serviceData);
      const filteredOffers = offerRes.offers.filter(
        (o: Offer) => o.conversation?.service?.service_title === serviceData.service_title
      );
      setOffers(filteredOffers);

      const groupedData = filteredOffers.reduce((acc: OfferChartData[], offer: Offer) => {
        const date = new Date(offer.created_at).toLocaleDateString();
        const existing = acc.find((d) => d.date === date);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      }, []);

      setChartData(groupedData);

      const total = filteredOffers.length;
      const accepted = filteredOffers.filter((o: Offer) => o.status === "accepted").length;
      const declined = filteredOffers.filter((o: Offer) => o.status === "declined").length;
      setOfferStats({ total, accepted, declined });

      setOpen(true);
    } catch (err) {
      console.error("Error loading service or offers", err);
      setError("Failed to load service or offers.");
    } finally {
      setLoadingService(false);
      setOffersLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <HashLoader color="#D39D55" />
    </div>
  );
  if (error) return <p className="text-red-500">{error}</p>;
  if (analytics.length === 0) return <p>No analytics data available</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Vendor Analytics</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Services</h2>
        <div className="grid gap-4">
          {analytics.map((item) => (
            <div
              key={item.service_id}
              className="p-4 border rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => loadServiceDetails(item.service_id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{item.service_title}</h3>
                <span className="text-sm text-gray-500">
                  {item.total_count} {item.metric_type === "service_view" ? "views" : "interactions"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Click to view details</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center pt-5">
              <DialogTitle>{selectedService?.service_title}</DialogTitle>
              <button
                onClick={() => setViewMode((prev) => (prev === "detailed" ? "chart" : "detailed"))}
                className="text-sm underline text-blue-600 hover:text-blue-800"
              >
                {viewMode === "detailed" ? "Show Chart" : "Show Details"}
              </button>
            </div>
          </DialogHeader>

          {loadingService ? (
            <p>Loading service details...</p>
          ) : selectedService && (
            <div className="space-y-6 text-sm">
              {viewMode === "detailed" ? (
                <>
                  <p className="text-muted-foreground">by {selectedService.display_name}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Service Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2">
                        <Badge variant="default" className="w-fit">
                          Views: {
                            analytics.find(item =>
                              item.metric_type === "service_view" &&
                              item.service_id === selectedService.service_id
                            )?.total_count || 0
                          }
                        </Badge>
                        <Badge variant="outline" className="w-fit">
                          Offers Sent: {offerStats.total}
                        </Badge>
                        <Badge variant="outline" className="w-fit">
                          Accepted: {offerStats.accepted}
                        </Badge>
                        <Badge variant="outline" className="w-fit">
                          Declined: {offerStats.declined}
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Service Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1">
                        <p><strong>Starting at:</strong> LKR {selectedService.starting_price}</p>
                        <p><strong>Notice Period:</strong> {selectedService.notice_period}</p>
                        <p><strong>Cancellation Policy:</strong> {selectedService.cancellation_policy}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-sm">
                    <p><strong>Tags:</strong> {selectedService.tags.join(", ")}</p>
                    <p><strong>Features:</strong> {selectedService.price_features.join(", ")}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mt-4">Offer History</h3>
                    {offersLoading ? (
                      <p>Loading offers...</p>
                    ) : offers.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No offers have been sent for this service.</p>
                    ) : (
                      <Accordion type="single" collapsible className="w-full mt-2">
                        {offers.map((offer) => (
                          <AccordionItem key={offer.id} value={offer.id}>
                            <AccordionTrigger>
                              Offer: LKR {offer.price} - <span className="ml-1 capitalize">{offer.status}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm space-y-1">
                              <p><strong>Description:</strong> {offer.description}</p>
                              <p><strong>Status:</strong> <Badge>{offer.status}</Badge></p>
                              <p><strong>Sent:</strong> {new Date(offer.created_at).toLocaleString()}</p>
                              <p><strong>Expires:</strong> {new Date(offer.expires_at).toLocaleString()}</p>
                              <p><strong>Payment:</strong> <Badge variant="outline">{offer.payment?.status || "Not started"}</Badge></p>
                              <p><strong>Client:</strong> {offer.conversation?.client?.first_name} ({offer.conversation?.client?.email})</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </div>
                </>
              ) : (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Offer Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  {chartData.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">No offer data to plot.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}