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
  business_email: string;
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
    async function fetchVendorDetails() {
      try {
        const res = await axios.get(`/api/admin/vendors/${selectedUser?.id}`);
        setVendorDetails(res.data.vendor);
      } catch (err) {
        console.error("Error fetching vendor details:", err);
        setVendorDetails(null);
      }
    }
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
      <h1 className="text-2xl text-center font-bold mb-10 pt-5">Admin User Management</h1>

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
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                "px-3 py-1 rounded border text-sm",
                currentPage === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              )}
            >
              {i + 1}
            </button>
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
        <DialogContent className="max-w-md break-words whitespace-normal">
          {selectedUser && (
            <div>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              <div className="mt-2 text-sm break-words whitespace-normal">
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
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedUser.is_vendor && selectedUser.role === "user" && (
                  <button
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    onClick={() => handleRoleUpdate("vendor")}
                  >
                    Approve as Vendor
                  </button>
                )}
                {selectedUser.role !== "admin" && (
                  <button
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    onClick={() => handleRoleUpdate("admin")}
                  >
                    Make Admin
                  </button>
                )}
              </div>
              {vendorDetails && (
                <div className="mt-6 border-t pt-4 text-sm break-words whitespace-normal">
                  <h3 className="text-md font-semibold mb-1">Vendor Details</h3>
                  <p>
                    <strong>Business Name:</strong>{" "}
                    {vendorDetails.business_name}
                  </p>
                  <p>
                    <strong>Display Name:</strong> {vendorDetails.display_name}
                  </p>
                  <p>
                    <strong>About:</strong> {vendorDetails.about}
                  </p>
                  <p>
                    <strong>Phone:</strong> {vendorDetails.business_phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {vendorDetails.business_email}
                  </p>
                  <p>
                    <strong>Address:</strong> {vendorDetails.city},{" "}
                    {vendorDetails.province}
                  </p>
                  <p>
                    <strong>Languages:</strong> {vendorDetails.languages}
                  </p>
                  <p>
                    <strong>Website:</strong> {vendorDetails.website || "N/A"}
                  </p>
                  <p>
                    <strong>Social Links:</strong> {vendorDetails.social_links}
                  </p>
                  {vendorDetails.profile_picture && (
                    <img
                      src={vendorDetails.profile_picture}
                      alt="Profile"
                      className="mt-3 rounded-lg w-full max-w-[200px] border"
                    />
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
