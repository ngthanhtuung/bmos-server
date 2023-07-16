import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class NewsUpdateDTO {
    @IsNotEmpty()
    @ApiProperty()
    public image: string;
    @IsNotEmpty()
    @ApiProperty()
    public desc: string;
    @IsNotEmpty()
    @ApiProperty()
    public title: string;
    @IsNotEmpty()
    @ApiProperty()
    public status: boolean;
}