export interface User {
  id: string;
  name: string;
  role?: Role;
  status: UserStatus;
  email: string;
}

export type Role = "ADMIN" | "SUPER_ADMIN" | "ANALYST";
export type UserStatus = "ACTIVE" | "INACTIVE" | "INVITED";

export interface AddUser {
  name: string;
  role?: Role;
  email: string;
}
