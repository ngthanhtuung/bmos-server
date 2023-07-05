import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../base/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import Meal from "../meal/meal.entity";

@Entity()
export default class Bird extends BaseEntity {

    @AutoMap()
    @Column('nvarchar', { name: 'birdName', nullable: false, length: 100 })
    public birdName: string;

    @AutoMap()
    @Column('nvarchar', { name: 'birdColor', nullable: false, length: 100 })
    public birdColor: string;

    @AutoMap()
    @Column('nvarchar', { name: 'images', nullable: false })
    public images: string;

    @AutoMap()
    @Column('boolean', { name: 'status', nullable: false, default: true })
    public status: boolean;

    @AutoMap()
    @OneToMany(() => Meal, (meal) => meal.bird, { onDelete: 'CASCADE' })
    public meals: Meal[];

}