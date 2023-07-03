import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsStrongPassword } from "class-validator";

export class AccountCreateDto {

    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'fullName'
    })
    public fullName: string;

    @IsNotEmpty()
    @ApiProperty({
        type: Date,
        description: 'dob',
        default: new Date().toISOString().slice(0, 10),
    })
    public dob: Date;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'email'
    })
    public email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty({
        type: String,
        description: 'password'
    })
    public password: string;

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty({
        type: String,
        description: 'confirmPassword'
    })
    public confirmPassword: string;

    @IsNotEmpty()
    @IsPhoneNumber('VN')
    @ApiProperty({ type: String, description: 'phoneNumber' })
    public phoneNumber: string;


}