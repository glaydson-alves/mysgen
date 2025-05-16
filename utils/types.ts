import { UserRole } from "src/users/entities/user.entity";

export type UserDatails = {
    email: string,
    displayName: string,
    url_avatar: string,
}

export type AuthJwtPayload = {
    sub: string;
};

export type CurrentUser = {
    id: string;
    role: UserRole;
};