import { Role } from "../generated/prisma/enums";

export type IAuthUser = {
  email?: string;
  role?: Role;
};
