import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsOptional } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {

    @IsOptional()
    name?: string;

    @IsOptional()
    price?: number;
    
    @IsOptional()
    description?: string;

    @IsOptional()
    duration_minutes?: number;

    @IsOptional()
    image_url?: string;
}
