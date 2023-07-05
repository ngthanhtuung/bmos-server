import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";


export class ProductCreateDto {

    @IsNotEmpty()
    @ApiProperty()
    public productName: string;

    @ApiProperty()
    public description: string;

    @IsNotEmpty()
    @ApiProperty({
        type: Date,
        default: new Date().toISOString().slice(0, 10),
    })
    public expiredDate: Date;

    @IsNumber()
    @ApiProperty({
        type: Number,
    })
    public price: number;

    @IsNotEmpty()
    @ApiProperty()
    public image: string;

    @IsNumber()
    @ApiProperty({
        type: Number,
        minimum: 0
    })
    public remainQuantity: number;

    @IsNumberString()
    @ApiProperty()
    public categoryId: string;
}