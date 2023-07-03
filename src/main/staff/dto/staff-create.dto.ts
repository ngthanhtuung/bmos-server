import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";
import { AccountCreateDto } from "src/main/account/dto/account-create.dto";


export default class StaffCreateDto extends AccountCreateDto {

    @IsNotEmpty()
    @ApiProperty()
    public identityNumber: string;

}