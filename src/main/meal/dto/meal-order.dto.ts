import { ApiProperty } from "@nestjs/swagger";


export class MealOrderDto {

    @ApiProperty()
    public id: string;
    @ApiProperty()
    public amount: number;

}