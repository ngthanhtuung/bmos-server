import { AutoMap } from "@automapper/classes";

export default class RoleDTO {

    @AutoMap()
    public id: number;

    @AutoMap()
    public name: string;
}