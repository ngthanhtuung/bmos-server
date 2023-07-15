import { IsBoolean } from "class-validator";
import { ProductCategoryCreateDto } from "./category-create.dto";
import { ApiProperty } from "@nestjs/swagger";


export class ProductCategoryUpdateDto extends ProductCategoryCreateDto {
    
    @IsBoolean()
    @ApiProperty({
        enum: [
            true,
            false
        ]
    })
    public status: boolean;
}