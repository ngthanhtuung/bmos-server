import { AutoMap } from "@automapper/classes";
import BaseDTO from "../base/base.dto";
import AccountDTO from "../account/account.dto";

export default class StaffDTO extends BaseDTO {

    @AutoMap()
    public identityNumber: string;

    @AutoMap()
    public registerDate: Date;

    @AutoMap()
    public quitDate: Date;

    @AutoMap({typeFn: () => AccountDTO})
    public account: AccountDTO;
}