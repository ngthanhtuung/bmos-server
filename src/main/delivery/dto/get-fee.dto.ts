import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";


export class ShippingFeeDto {

    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty()
    wardCode: string;

    @IsNumber()
    @ApiProperty()
    districtId: number;
}