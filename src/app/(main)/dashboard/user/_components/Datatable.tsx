"use client";

import { Trash2, Eye, Edit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { User } from "./type";

interface DataTableProps {
  users: User[];
  onDelete: (id: string) => void;
  onResync: (id: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onEdit: (id: string) => void;
  loading?: boolean; // Add loading prop
}

// Simple skeleton loader component
const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
    </TableCell>
  </TableRow>
);

export default function DataTable({
  users,
  onDelete,
  onView,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPreviousPage,
  onNextPage,
  onEdit,
  loading = false, // Default to false
}: DataTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "INACTIVE":
        return "bg-red-100 text-yellow-800 hover:bg-yellow-100";
      case "INVITED":
        return "bg-yellow-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            // Render skeleton rows when loading
            Array.from({ length: itemsPerPage }).map((_, index) => <SkeletonRow key={index} />)
          ) : users.length === 0 ? (
            // Handle empty state
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            // Render actual data
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + users.indexOf(user) + 1}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(user.id)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <div className="flex items-center text-sm text-gray-500">
          {loading ? (
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          ) : (
            `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
              currentPage * itemsPerPage,
              totalItems,
            )} of ${totalItems} results`
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPreviousPage} disabled={currentPage === 1 || loading}>
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
            ) : (
              Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="h-8 w-8 p-0"
                  disabled={loading}
                >
                  {page}
                </Button>
              ))
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onNextPage} disabled={currentPage === totalPages || loading}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
