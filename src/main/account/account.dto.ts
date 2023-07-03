import { AutoMap } from "@automapper/classes";
import BaseDTO from "../base/base.dto";
import RoleDTO from "../role/role.dto";

export default class AccountDTO extends BaseDTO {

    @AutoMap()
    public fullName: string;

    @AutoMap()
    public dob: Date;

    @AutoMap()
    public email: string;

    @AutoMap()
    public password: string;

    @AutoMap()
    public phoneNumber: string;

    @AutoMap()
    public avatar: string;
    s
    @AutoMap()
    public status: string

    @AutoMap()
    public refreshToken: string;

    @AutoMap({ typeFn: () => RoleDTO })
    public role: RoleDTO;
}