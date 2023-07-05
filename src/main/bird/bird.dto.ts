import { AutoMap } from "@automapper/classes";
import BaseDTO from "../base/base.dto";


export class BirdDTO extends BaseDTO {

    @AutoMap()
    public birdName: string;

    @AutoMap()
    public birdColor: string;

    @AutoMap()
    public images: string;

    @AutoMap()
    public status: boolean;
}