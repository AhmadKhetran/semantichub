"use client";

import { Trash2, Eye, Edit, RefreshCw, LayoutDashboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Connection } from "./type";

interface DataTableProps {
  connections: Connection[];
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
  loading?: boolean;
  onView: (id: string) => void;
  onTake: (id: string) => void;
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
  connections,
  onDelete,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPreviousPage,
  onNextPage,
  loading = false, // Default to false
  onResync,
  onView,
  onTake,
}: DataTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "ERROR":
        return "bg-red-100 text-yellow-800 hover:bg-yellow-100";
      case "IN_PROGRESS":
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
            <TableHead>Host</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Datasource</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => <SkeletonRow key={index} />)
          ) : connections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No Connections found
              </TableCell>
            </TableRow>
          ) : (
            // Render actual data
            connections.map((con) => (
              <TableRow key={con.id}>
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + connections.indexOf(con) + 1}
                </TableCell>
                <TableCell>{con.catalogueName}</TableCell>
                <TableCell>{con.host}</TableCell>
                <TableCell>{con.type}</TableCell>
                <TableCell>{con.datasource}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(con.status)}>{con.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onTake(con.id)} className="h-8 w-8 p-0">
                      <LayoutDashboard className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => onView(con.id)} className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onResync(con.id)} className="h-8 w-8 p-0">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(con.id)}
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
