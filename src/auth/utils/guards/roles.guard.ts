import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from "src/users/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflextor: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflextor.getAllAndOverride<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) return true;
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user.role);
    }
}