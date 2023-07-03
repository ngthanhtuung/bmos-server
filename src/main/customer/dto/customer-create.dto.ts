import { AccountCreateDto } from "src/main/account/dto/account-create.dto";

export class CustomerCreateDto extends AccountCreateDto {
    public point: number;
}