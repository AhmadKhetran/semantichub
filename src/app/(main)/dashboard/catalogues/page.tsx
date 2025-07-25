"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import AddConnectionForm from "./_components/AddConnectionForm";
import DataTable from "./_components/Datatable";
import { Connection } from "./_components/types";

export default function Page() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      type: "PostgreSQL",
      name: "Production DB",
      status: "Active",
      host: "prod-db.example.com",
      port: "5432",
      datasource: "main_db",
      username: "admin",
    },
    {
      id: "2",
      type: "MySQL",
      name: "Analytics DB",
      status: "Inactive",
      host: "analytics.example.com",
      port: "3306",
      datasource: "analytics",
      username: "analyst",
    },
    {
      id: "3",
      type: "MongoDB",
      name: "User Data",
      status: "Error",
      host: "mongo.example.com",
      port: "27017",
      datasource: "users",
      username: "mongo_user",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleAddConnection = (newConnection: Omit<Connection, "id">) => {
    const connection: Connection = {
      ...newConnection,
      id: (connections.length + 1).toString(),
    };
    setConnections([...connections, connection]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setConnections(connections.filter((conn) => conn.id !== id));
  };

  const handleResync = (id: string) => {
    setConnections(connections.map((conn) => (conn.id === id ? { ...conn, status: "Active" as const } : conn)));
  };

  const handleView = (id: string) => {
    const connection = connections.find((conn) => conn.id === id);
    if (connection) {
      alert(`Viewing connection: ${connection.name}\nHost: ${connection.host}\nPort: ${connection.port}`);
    }
  };

  return (
    <div className="@container/main mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Catalogues</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <DataTable connections={connections} onDelete={handleDelete} onResync={handleResync} onView={handleView} />

      {showForm && <AddConnectionForm onSubmit={handleAddConnection} onCancel={() => setShowForm(false)} />}
    </div>
  );
}
