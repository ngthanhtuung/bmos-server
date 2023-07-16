import { IsNotEmpty } from "class-validator";
import { MealCreateDto } from "./meal-create.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ProductInMealDto {

    @ApiProperty()
    public id: string;
    @ApiProperty()
    public amount: number;
}
export class ListSectionDTO {
    @ApiProperty()
    public section: Array<ProductInMealDto>;

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
        type: [ListSectionDTO],
    })
    public sections: ListSectionDTO[]
}