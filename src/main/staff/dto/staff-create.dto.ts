import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";
import { AccountCreateDto } from "src/main/account/dto/account-create.dto";


export default class StaffCreateDto extends AccountCreateDto {

    @IsNotEmpty()
    @ApiProperty()
    public identityNumber: string;

    @ApiProperty({
        default: 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg'
    })
    public avatar: string;


}