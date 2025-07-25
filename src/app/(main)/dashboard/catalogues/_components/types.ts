export interface Connection {
  id: string;
  type: string;
  name: string;
  status: "Active" | "Inactive" | "Error";
  host: string;
  port: string;
  datasource: string;
  username: string;
}
