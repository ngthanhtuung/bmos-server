import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator";
import { MealCheckDto } from "src/main/meal/dto/meal-check.dto";
import { MealOrderDto } from "src/main/meal/dto/meal-order.dto";


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


    @IsNumber()
    @ApiProperty()
    public shippingProvinceCode: number;

    @IsNumber()
    @ApiProperty()
    public shippingDistrictCode: number;

    @IsNotEmpty()
    @ApiProperty()
    public shippingWardCode: string;


    @IsNumber()
    @ApiProperty()
    public shippingFee: number;

    @IsNotEmpty()
    @ApiProperty()
    public paymentType: string;

    @IsNotEmpty()
    @ApiProperty({
        type: [MealOrderDto]
    })
    public meals: MealOrderDto[];

}