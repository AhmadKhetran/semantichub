"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Role, User } from "./type";

interface EditUserFormProps {
  user: User;
  onSubmit: (connection: User) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function EditConnectionForm({ user, onSubmit, onCancel, loading }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    id: user.id,
    name: user.name,
    role: user.role,
    status: user.status,
    email: user.email,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      ...formData,
    } as User);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1">
            <div className="w-full">
              <Label htmlFor="role" className="mb-2">
                Role *
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value as Role)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select User Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="ANALYST">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1">
            <div className="w-full">
              <Label htmlFor="role" className="mb-2">
                Status *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                disabled={formData.status === "INVITED"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select User Status" />
                </SelectTrigger>
                {formData.status === "INVITED" ? (
                  <SelectContent>
                    <SelectItem value="INVITED">Invited</SelectItem>
                  </SelectContent>
                ) : (
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                )}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="username" className="mb-2">
              User Name *
            </Label>
            <Input
              id="username"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="user name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="mb-2">
              email *
            </Label>
            <Input
              id="email"
              value={formData.email}
              type="email"
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="example@gmail.com"
              required
              disabled
            />
          </div>

          <DialogFooter>
            {loading ? (
              <>
                <div className="flex h-8 w-24 animate-pulse items-center justify-center rounded-md bg-gray-100 shadow-sm">
                  <span className="text-sm font-medium text-gray-500">Loading...</span>
                </div>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">Update User</Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
