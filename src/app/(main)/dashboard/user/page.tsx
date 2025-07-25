"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import AddUserForm from "./_components/AddUserForm";
import ConfirmDialog from "./_components/ConfimationDialog";
import DataTable from "./_components/Datatable";
import EditUserForm from "./_components/EditUserForm";
import { User } from "./_components/type";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({
    open: false,
    userId: "",
    userName: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const res = await fetch("/api/user/get-users");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        } else {
          console.error(data.error || "Failed to load users.");
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handleAddUser = async (newUser: Omit<User, "id">) => {
    setLoading(true);

    try {
      const response = await fetch("/api/user/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user.");
      }

      const user: User = {
        ...data.data,
      };

      setUsers([...users, user]);
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
      const id = deleteDialog.userId;
      const res = await fetch(`/api/user/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast("User Deleted successfully!");
        setUsers(users.filter((us) => us.id !== id));
      } else {
        toast("Failed to delete user!");
        console.error(data.error || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Unexpected error while deleting user:", error);
    }
  };

  const handleResync = (id: string) => {
    setUsers(users.map((us) => (us.id === id ? { ...us, status: "ACTIVE" as const } : us)));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleEdit = (id: string) => {
    const user = users.find((conn) => conn.id === id);
    if (user) {
      setEditingUser(user);
    }
  };

  const handleEditUser = async (updateUser: User) => {
    console.log("updateUserData", updateUser);
    setLoading(true);
    try {
      const res = await fetch(`/api/user/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUser),
      });

      const data = await res.json();

      if (res.ok) {
        toast("User updated successfully!");
        setUsers((prev) =>
          prev.map((user) =>
            user.id === updateUser.id
              ? { ...user, status: updateUser.status, role: updateUser.role, name: updateUser.name }
              : user,
          ),
        );
        setEditingUser(null);
      } else {
        toast("Failed to update user!");
        console.error(data.error || "Failed to delete user.");
      }
      setLoading(false);
    } catch (error) {
      setEditingUser(null);
      setLoading(false);
      console.error("Unexpected error while deleting user:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    const user = users.find((us) => us.id === id);
    if (user) {
      setDeleteDialog({
        open: true,
        userId: id,
        userName: user.name,
      });
    }
  };

  return (
    <div className="@container/main mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <DataTable
        users={currentUsers}
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
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open: any) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteDialog.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {showForm && <AddUserForm onSubmit={handleAddUser} onCancel={() => setShowForm(false)} loading={loading} />}

      {editingUser && (
        <EditUserForm
          user={editingUser}
          onSubmit={handleEditUser}
          onCancel={() => setEditingUser(null)}
          loading={loading}
        />
      )}
    </div>
  );
}
