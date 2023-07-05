import { AutoMap } from "@automapper/classes";
import BaseDTO from "../base/base.dto";
import { BirdDTO } from "../bird/bird.dto";


export class MealDTO extends BaseDTO {

    @AutoMap()
    public title: string;

    @AutoMap()
    public description: string;

    @AutoMap()
    public createdBy: string;

    @AutoMap()
    public status: boolean;

    @AutoMap({ typeFn: () => BirdDTO })
    public bird: BirdDTO;

}