import { AutoMap } from "@automapper/classes";

export default class CategoryDto {

    @AutoMap()
    public id: number;

    @AutoMap()
    public name: string;

}