import { IsBoolean, IsNotEmpty } from "class-validator";
import { ProductCreateDto } from "./product-create.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ProductUpdateDto extends ProductCreateDto {
    
    @IsBoolean()
    @ApiProperty({
        type: Boolean
    })
    public status: boolean;
}