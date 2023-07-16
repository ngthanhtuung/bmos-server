import { IsNotEmpty } from "class-validator";
import { MealCreateDto } from "./meal-create.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ProductInMealDto {

    @ApiProperty()
    public id: string;
    @ApiProperty()
    public amount: number;
    @ApiProperty({
        type: String,
        example: ["Morning", "Afternoon", "Evening"]
    }
    )
    public section: Array<string>;

}
export class MealUpdateDto {
    @IsNotEmpty()
    @ApiProperty()
    public id: string;

    @IsNotEmpty()
    @ApiProperty()
    public status: boolean;

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