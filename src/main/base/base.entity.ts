import { AutoMap } from "@automapper/classes";
import { PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {

    @AutoMap()
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    public id: string;
}