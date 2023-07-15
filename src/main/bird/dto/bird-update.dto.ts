import { IsBoolean } from "class-validator";
import { BirdCreateDto } from "./bird-create.dto";
import { ApiProperty } from "@nestjs/swagger";


export class BirdUpdateDto extends BirdCreateDto {

    @IsBoolean()
    @ApiProperty({
        enum: [
            true,
            false
        ]
    })
    public status: boolean;

}