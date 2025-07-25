export interface Connection {
  id: string;
  type: string;
  catalogueName: string;
  status: "Active" | "Inactive" | "Error";
  host: string;
  port: string;
  datasource: string;
  username: string;
}
