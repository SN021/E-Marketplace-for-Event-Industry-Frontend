"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { HashLoader } from "react-spinners";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Service = {
	service_id: string;
	service_title: string;
	category: string;
	thumbnail_url: string;
};

type ServicesHistoryProps = {
	onEditService: (serviceId: string) => void;
};

type RemoveServiceButtonProps = {
	serviceId: string;
	onRemoved?: (serviceId: string) => void;
};

export default function ServicesHistory({
	onEditService,
}: ServicesHistoryProps) {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	const { logAnalytics } = useAnalytics();

	const logServiceView = async (serviceId: string) => {
		try {
			await logAnalytics(serviceId, "service_view");
		} catch (error) {
			console.error("Failed to log service view", error);
		}
	};

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const res = await axios.get("/api/services/get-service-by-vendorid");
				setServices(res.data);
			} catch (err) {
				console.error("Error fetching services:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchServices();
	}, []);

	if (loading)
		return (
			<div className="flex justify-center items-center h-full">
				<HashLoader color="#D39D55" />
			</div>
		);

	if (services.length === 0)
		return (
			<div>
				<div className="pb-3">
					<Link href="/dashboard/create-service">
						<Button variant={"default"} className="text-xs">
							<span>
								<Plus />
							</span>
							Add New Service
						</Button>
					</Link>
				</div>
				<div className="text-gray-500 flex justify-center items-center h-full">
					Service listing history will appear here.
				</div>
			</div>
		);

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-xl font-semibold mb-3">Vendor Services History</h1>
			<div className="pb-3">
				<Link href="/dashboard/create-service">
					<Button variant={"default"} className="text-xs">
						<span>
							<Plus />
						</span>
						Add New Service
					</Button>
				</Link>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 mx-auto gap-6">
				{services.map((service) => (
					<div
						key={service.service_id}
						className="bg-white shadow rounded-lg p-4 flex flex-col w-full max-w-[320px] sm:max-w-full justify-between "
						onClick={() => logServiceView(service.service_id)}
					>
						<div>
							<Image
								src={service.thumbnail_url || "/placeholder.jpg"}
								alt={service.service_title}
								width={400}
								height={300}
								className="rounded-md h-[200px] object-cover"
							/>

							<div className="mt-4">
								<h2 className="text-lg font-semibold">
									{service.service_title}
								</h2>
								<p className="text-gray-500">{service.category}</p>
							</div>
						</div>
						<div className="flex gap-2 mt-4">
							<Button
								size="sm"
								onClick={() => onEditService(service.service_id)}
							>
								Edit
							</Button>

							<AlertDialog open={open} onOpenChange={setOpen}>
								<AlertDialogTrigger asChild>
									<Button
										size="sm"
										variant="secondary"
										className="bg-red-500 hover:bg-red-400 text-white"
									>
										Remove
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete service?</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete this service? This action
											cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel disabled={loading}>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											className="bg-red-500 hover:bg-red-400 text-white"
											onClick={async () => {
												try {
													setLoading(true);
													await axios.delete(
														`/api/services/edit-service/${service.service_id}`
													);
													setServices((prev) =>
														prev.filter(
															(s) => s.service_id !== service.service_id
														)
													);
													setOpen(false); // close dialog after success
												} catch (error) {
													console.error("Failed to delete service:", error);
													alert("Something went wrong. Please try again.");
												} finally {
													setLoading(false);
												}
											}}
											disabled={loading}
										>
											{loading ? "Removing..." : "Delete"}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
