import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNotEmptyObject, IsNumber } from "class-validator";


export class ProductInMealDto {

    @ApiProperty()
    public id: string;
    @ApiProperty({
        type: Number,
        example: 1
    }
    )
    public amount: number;

}

export class MealCreateDto {

    @IsNotEmpty()
    @ApiProperty()
    public title: string;

    @IsNotEmpty()
    @ApiProperty()
    public description: string;

    @IsNotEmpty()
    @ApiProperty()
    public birdId: string;

    @IsNotEmpty()
    @ApiProperty()
    public image: string;

    @IsNotEmpty()
    @ApiProperty({
        type: [ProductInMealDto],
    })
    public products: ProductInMealDto[];
}


