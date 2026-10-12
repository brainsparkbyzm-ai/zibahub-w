export type Role = "USER" | "EMPLOYER" | "ADMIN";

export type SessionClaims = {
  sub: string;
  sid: string;
  role: Role;
  email: string;
  name: string;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  emailVerifiedAt: string | null;
  status: "ACTIVE" | "SUSPENDED";
};
