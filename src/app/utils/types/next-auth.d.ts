import NextAuth from "next-auth";

import { Role } from "@/app/(main)/dashboard/user/_components/type";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: Role;
      status: "ACTIVE" | "INACTIVE" | "INVITED";
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: Role;
    status: "ACTIVE" | "INACTIVE" | "INVITED";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
    role?: Role;
    status: "ACTIVE" | "INACTIVE" | "INVITED";
  }
}
