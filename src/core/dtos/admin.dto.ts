import { UserRole } from "../entities";

export type AdminUpdateUserDto =  {
    name?: string;
    email?: string;
    userEmail:string;
    password?: string;
    role?: UserRole;
    accessToken?: string;
};
