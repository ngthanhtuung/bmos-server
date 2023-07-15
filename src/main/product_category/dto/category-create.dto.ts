import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class ProductCategoryCreateDto {

    @IsNotEmpty()
    @ApiProperty({
        type: String,
        maxLength: 255,
    })
    public categoryName: string;
}