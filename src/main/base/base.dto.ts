import { AutoMap } from '@automapper/classes';
export default class BaseDTO {

    @AutoMap()
    public id: string;

}