import { IsString } from 'class-validator';
export class CreateEnterpriseDto {
    @IsString()
    public_name: string;
    @IsString()
    whatsapp_number: string;
    @IsString()
    address: string;
    @IsString()
    logo_url: string;
    @IsString()
    banner_url: string;
    @IsString()
    opening_time: string;
    @IsString()
    closing_time: string;
    @IsString()
    closed_days: string;
    @IsString()
    slug: string;
}
