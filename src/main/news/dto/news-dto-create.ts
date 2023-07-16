import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class NewsCreateDto {

    @IsNotEmpty()
    @ApiProperty()
    public name: string;

    @IsNotEmpty()
    @ApiProperty()
    public image: string;

    @IsNotEmpty()
    @ApiProperty()
    public desc: string;
    @IsNotEmpty()
    @ApiProperty()
    public title: string;
}