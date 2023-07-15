import { AutoMap } from "@automapper/classes";

export default class CategoryDto {

    @AutoMap()
    public id: number;

    @AutoMap()
    public status: boolean;

    @AutoMap()
    public name: string;

}