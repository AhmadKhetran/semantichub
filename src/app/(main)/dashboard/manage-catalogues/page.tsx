"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import AddConnectionForm from "./_components/AddConnectionForm";
import ConfirmDialog from "./_components/ConfimationDialog";
import DataTable from "./_components/Datatable";
import { Connection } from "./_components/type";
import ViewForm from "./_components/ViewForm";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [viewForm, setViewForm] = useState<Connection>();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    connectionId: string;
    connectionName: string;
  }>({
    open: false,
    connectionId: "",
    connectionName: "",
  });

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const res = await fetch("/api/connections/get-connections");
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setConnections(data.connections);
        } else {
          console.error(data.error || "Failed to load connection.");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const totalItems = connections.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConnections = connections.slice(startIndex, endIndex);

  const handAddConnection = async (newConnection: Omit<Connection, "id">) => {
    setLoading(true);

    try {
      const payload = {
        ...newConnection,
        createdById: session?.user.id,
      };

      const response = await fetch("/api/connections/create-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user.");
      }

      console.log("data", data);

      const connection: Connection = {
        ...data.data,
      };

      setConnections([...connections, connection]);
      toast("User added successfully!");
      setShowForm(false);
    } catch (error: any) {
      console.error("Add user error:", error);
      toast(error.message || "Something went wrong while adding user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const id = deleteDialog.connectionId;
      const res = await fetch(`/api/connection/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast("User Deleted successfully!");
        setConnections(connections.filter((con) => con.id !== id));
      } else {
        toast("Failed to delete user!");
        console.error(data.error || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Unexpected error while deleting user:", error);
    }
  };

  const handleResync = (id: string) => {};

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleEdit = (id: string) => {};

  const handleView = async (id: string) => {
    const connection = connections.find((e) => e.id === id);
    setViewForm(connection);
  };

  const handleDeleteClick = (id: string) => {
    const user = connections.find((us) => us.id === id);
    if (user) {
      setDeleteDialog({
        open: true,
        connectionId: id,
        connectionName: user.catalogueName,
      });
    }
  };

  const handleTake = (id: string) => {
    router.push(`/dashboard/overview?catalogueId=${id}`);
  };

  return (
    <div className="@container/main mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Connections</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <DataTable
        connections={currentConnections}
        onDelete={handleDeleteClick}
        onResync={handleResync}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onEdit={handleEdit}
        loading={loading}
        onView={handleView}
        onTake={handleTake}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open: any) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteDialog.connectionName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {showForm && (
        <AddConnectionForm onSubmit={handAddConnection} onCancel={() => setShowForm(false)} loading={loading} />
      )}
      {viewForm && <ViewForm connection={viewForm} onCancel={() => setViewForm(undefined)} />}
    </div>
  );
}
