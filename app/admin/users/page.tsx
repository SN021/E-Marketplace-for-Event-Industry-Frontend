"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  email: string;
  username: string;
  role: "user" | "vendor" | "admin";
  is_vendor: boolean;
  created_at: string;
};

type Vendor = {
  business_name: string;
  display_name: string;
  about: string;
  business_phone: string;
  paypal_email: string;
  city: string;
  province: string;
  languages: string;
  website: string | null;
  social_links: string;
  profile_picture: string | null;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [vendorDetails, setVendorDetails] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [vendorRequestFilter, setVendorRequestFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorLoading, setVendorLoading] = useState(false);

  const USERS_PER_PAGE = 8;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("/api/admin/fetch-users");
        setUsers(res.data.users);
      } catch (err: any) {
        if (err.response?.status === 403) {
          window.location.href = "/forbidden";
        } else {
          console.error("Error fetching users:", err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser || !selectedUser.is_vendor) {
      setVendorDetails(null);
      return;
    }

    const fetchVendorDetails = async () => {
      setVendorLoading(true);
      try {
        const res = await axios.get(`/api/admin/vendors/${selectedUser?.id}`);
        setVendorDetails(res.data.vendor);
      } catch (err) {
        console.error("Error fetching vendor details:", err);
        setVendorDetails(null);
      } finally {
        setVendorLoading(false);
      }
    };

    fetchVendorDetails();
  }, [selectedUser]);

  const handleRoleUpdate = async (role: User["role"]) => {
    if (!selectedUser) return;
    try {
      await axios.patch(`/api/admin/fetch-users/${selectedUser.id}`, { role });
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role } : u))
      );
      setSelectedUser(null);
      setVendorDetails(null);
    } catch (err) {
      console.error("Role update failed:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const roleMatch = roleFilter === "all" || u.role === roleFilter;
    const vendorMatch =
      vendorRequestFilter === "all" ||
      (vendorRequestFilter === "requested" && u.is_vendor);
    return roleMatch && vendorMatch;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl text-center font-bold mb-10 pt-5">
        Admin User Management
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex gap-4 items-center">
          <label className="font-medium">Filter by Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="all">All</option>
            <option value="admin">Admins</option>
            <option value="vendor">Vendors</option>
            <option value="user">Users</option>
          </select>
        </div>
        <div className="flex gap-4 items-center">
          <label className="font-medium">Vendor Request:</label>
          <select
            value={vendorRequestFilter}
            onChange={(e) => {
              setVendorRequestFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="all">All</option>
            <option value="requested">Requested Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Table className="w-full border text-sm">
          <TableHeader className="bg-gray-100 border-b">
            <TableRow>
              <TableHead className="p-2 break-words whitespace-normal">
                Email
              </TableHead>
              <TableHead className="p-2 break-words whitespace-normal">
                Username
              </TableHead>
              <TableHead className="p-2 break-words whitespace-normal">
                Role
              </TableHead>
              <TableHead className="p-2 break-words whitespace-normal">
                Requested Vendor?
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((u) => (
              <TableRow
                key={u.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedUser(u)}
              >
                <TableCell className="p-2 break-words whitespace-normal">
                  {u.email}
                </TableCell>
                <TableCell className="p-2 break-words whitespace-normal">
                  {u.username}
                </TableCell>
                <TableCell className="p-2 capitalize break-words whitespace-normal">
                  {u.role}
                </TableCell>
                <TableCell className="p-2 break-words whitespace-normal">
                  {u.is_vendor ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                "",
                currentPage === i + 1
                  ? ""
                  : "bg-white text-gray-700 border-gray-300"
              )}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>

      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
            setVendorDetails(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          {selectedUser && (
            <>
              <DialogHeader className="shrink-0">
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>

              <div className="overflow-y-auto pr-2 text-sm break-words whitespace-normal flex-1 mt-2">
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Username:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>Current Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Vendor Requested:</strong>{" "}
                  {selectedUser.is_vendor ? "Yes" : "No"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedUser.is_vendor && selectedUser.role === "user" && (
                    <Button
                      onClick={() => handleRoleUpdate("vendor")}
                    >
                      Approve as Vendor
                    </Button>
                  )}
                  {selectedUser.role !== "admin" && (
                    <Button
                      className="bg-red-500 hover:bg-red-400"
                      onClick={() => handleRoleUpdate("admin")}
                    >
                      Make Admin
                    </Button>
                  )}
                </div>

                {selectedUser.is_vendor && (
                  <div className="mt-6 border-t pt-4">
                    {vendorLoading ? (
                      <div className="text-center text-sm text-gray-500 py-4">
                        <Loader />
                      </div>
                    ) : vendorDetails ? (
                      <>
                        <h3 className="text-md font-semibold mb-3 text-gray-800 border-b pb-1">
                          Vendor Details
                        </h3>

                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center justify-center gap-5">
                            {vendorDetails.profile_picture && (
                              <div className="mt-4">
                                <div className="mt-2 w-32 h-32 rounded-full overflow-hidden border">
                                  <img
                                    src={vendorDetails.profile_picture}
                                    alt="Vendor Profile"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="mt-4 flex flex-col gap-5">
                              <p>
                                <strong>Business Name:</strong>{" "}
                                {vendorDetails.business_name}
                              </p>
                              <p>
                                <strong>Display Name:</strong>{" "}
                                {vendorDetails.display_name}
                              </p>
                            </div>
                          </div>
                          <p>
                            <strong>About:</strong>{" "}
                            <span className="block text-gray-600 whitespace-pre-line">
                              {vendorDetails.about}
                            </span>
                          </p>
                          <p>
                            <strong>Phone:</strong>{" "}
                            {vendorDetails.business_phone}
                          </p>
                          <p>
                            <strong>Email:</strong>{" "}
                            {vendorDetails.paypal_email}
                          </p>
                          <p>
                            <strong>Address:</strong> {vendorDetails.city},{" "}
                            {vendorDetails.province}
                          </p>

                          <div>
                            <strong>Languages:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {JSON.parse(vendorDetails.languages).map(
                                (lang: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {lang}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          <p>
                            <strong>Website:</strong>{" "}
                            {vendorDetails.website || (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </p>

                          <div>
                            <strong>Social Links:</strong>
                            <ul className="list-disc pl-5 space-y-1 mt-1 text-blue-600 underline">
                              {JSON.parse(vendorDetails.social_links).map(
                                (link: { url: string }, idx: number) => (
                                  <li key={idx}>
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {link.url}
                                    </a>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-red-500">
                        Failed to load vendor details.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
