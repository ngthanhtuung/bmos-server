import { AutoMap } from "@automapper/classes";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base/base.entity";

@Entity()
export default class News extends BaseEntity {

    @AutoMap()
    @Column('nvarchar', { name: 'name', nullable: false })
    public name: string;

    @AutoMap()
    @Column('nvarchar', { name: 'image', nullable: true })
    public image: string;

    @AutoMap()
    @Column('nvarchar', { name: 'createDate', nullable: true })
    public createDate: string;
    @AutoMap()
    @Column('nvarchar', { name: 'desc', nullable: true })
    public desc: string;

    @AutoMap()
    @Column('nvarchar', { name: 'title', nullable: true })
    public title: string;
    @AutoMap()
    @Column('boolean', { name: 'status', nullable: true, default: true })
    public status: boolean;

}