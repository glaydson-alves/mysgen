import { UserRole } from "src/users/entities/user.entity";

export type UserDatails = {
    email: string,
    displayName: string,
    url_avatar: string,
}

export type AuthJwtPayload = {
    sub: number;
};

export type CurrentUser = {
    id: number;
    role: UserRole;
};