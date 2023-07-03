import { AutoMap } from "@automapper/classes";
import AccountDTO from "../account/account.dto";
import BaseDTO from "../base/base.dto";


export default class CustomerDTO extends BaseDTO {

    @AutoMap()
    public point: number;

    @AutoMap({ typeFn: () => AccountDTO })
    public account: AccountDTO;
}