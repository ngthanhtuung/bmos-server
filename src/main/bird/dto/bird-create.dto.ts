import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class BirdCreateDto {

    @IsNotEmpty()
    @ApiProperty()
    public birdName: string;

    @IsNotEmpty()
    @ApiProperty()
    public birdColor: string;

    @IsNotEmpty()
    @ApiProperty()
    public images: string;

}