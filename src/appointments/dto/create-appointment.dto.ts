import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity";

export class CreateAppointmentDto {

    @IsNumber()
    @IsNotEmpty()
    service_id: number;

    @IsNotEmpty()
    scheduled_day: Date;

    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus
}
