import { ApiProperty, OmitType } from "@nestjs/swagger";
import { AccountCreateDto } from "./account-create.dto";


export class AccountUpdateProfileDto extends OmitType(AccountCreateDto, ['email', 'password', 'confirmPassword'] as const) {

    @ApiProperty({
        type: String,
        description: 'avatar'
    })
    public avatar: string;

}