export interface Connection {
  id: string;
  type: string;
  catalogueName: string;
  status: "ACTIVE" | "IN_PROGRESS" | "ERROR";
  host: string;
  port: string;
  datasource: string;
  username: string;
  createdBy?: any;
  password?: any;
}
