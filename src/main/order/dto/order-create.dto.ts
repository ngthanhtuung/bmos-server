import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator";
import { MealCheckDto } from "src/main/meal/dto/meal-check.dto";


export class OrderCreateDto {

    @IsNotEmpty()
    @ApiProperty()
    public name: string;

    @IsPhoneNumber('VN')
    @ApiProperty()
    public phone: string;

    @IsNotEmpty()
    @ApiProperty()
    public shippingAddress: string;

    @IsNotEmpty()
    @ApiProperty()
    public shippingWardCode: string;

    @IsNumber()
    @ApiProperty()
    public shippingDistrictCode: number;

    @IsNumber()
    @ApiProperty()
    public shippingFee: number;

    @IsNotEmpty()
    @ApiProperty({
        type: [MealCheckDto]
    })
    public meals: MealCheckDto[];

}