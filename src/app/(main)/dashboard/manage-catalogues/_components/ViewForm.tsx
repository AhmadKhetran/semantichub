"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Connection } from "./type";

interface ViewConnectionFormProps {
  onCancel: () => void;
  connection: Connection;
}

export default function ViewForm({ onCancel, connection }: ViewConnectionFormProps) {
  const [formData, setFormData] = useState({
    host: connection.host,
    port: connection.port,
    type: connection.type,
    datasource: connection.datasource,
    username: connection.username,
    catalogueName: connection.catalogueName,
    password: connection.password,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Connection</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host">Host *</Label>
              <Input
                id="host"
                value={formData.host}
                onChange={(e) => handleInputChange("host", e.target.value)}
                placeholder="localhost"
                required
                className="mt-2"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="port">Port *</Label>
              <Input
                id="port"
                value={formData.port}
                onChange={(e) => handleInputChange("port", e.target.value)}
                placeholder="5432"
                required
                className="mt-2"
                disabled
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">Connection Name *</Label>
            <Input
              id="name"
              value={formData.catalogueName}
              onChange={(e) => handleInputChange("catalogueName", e.target.value)}
              placeholder="My Database"
              required
              className="mt-2"
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <Label htmlFor="type" className="mb-2">
                Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)} disabled>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AIR_LINE">Air Line</SelectItem>
                  <SelectItem value="MEDICAL">Medical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label htmlFor="datasource" className="mb-2">
                Datasource *
              </Label>
              <Select
                value={formData.datasource}
                onValueChange={(value) => handleInputChange("datasource", value)}
                disabled
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select datasource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POSTGRESQL">Postgres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="username" className="mb-2">
              User Name *
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="admin"
              required
              disabled
            />
          </div>

          <div>
            <Label htmlFor="password" className="mb-2">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="••••••••"
              required
              disabled
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
