import { UserRole } from "@/types/platform";

export const ROLES: UserRole[] = [
  "candidate",
  "recruiter",
  "company_admin",
  "platform_admin"
];

export const RECRUITER_ROLES: UserRole[] = [
  "recruiter",
  "company_admin",
  "platform_admin"
];

export function hasRole(role: UserRole, allowedRoles: UserRole[]) {
  return allowedRoles.includes(role) || role === "platform_admin";
}
