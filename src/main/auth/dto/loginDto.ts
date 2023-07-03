import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { RoleEnum } from "src/main/role/role.enum";


export class LoginDto {

    @IsNotEmpty()
    @ApiProperty()
    public email: string;

    @IsNotEmpty()
    @ApiProperty()
    public password: string;

    @IsNotEmpty()
    @ApiProperty({ enum: RoleEnum })
    public role: RoleEnum;
}