// src/lib/auth/auth.d.ts
import { Session as DefaultSession } from "next-auth";
import { User as DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

// Extend the Session and User interfaces
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage: string;
      roles: string[];
    };
  }

  interface User extends DefaultUser {
    firstName: string;
    lastName: string;
    profileImage: string;
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    roles: string[];
  }
}
