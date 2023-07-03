import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class ChangePasswordDto {

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty({
        type: String,
        description: 'oldPassword',
    })
    public oldPassword: string;

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty({
        type: String,
        description: 'newPassword',
    })
    public newPassword: string;

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty({
        type: String,
        description: 'confirmNewPassword',
    })
    public confirmNewPassword: string;
}