import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../base/base.entity";
import ProductMeal from "../product_meal/product_meal.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import Bird from "../bird/bird.entity";
import OrderDetail from "../order_detail/order_detail.entity";

@Entity()
export default class Meal extends BaseEntity {

    @AutoMap()
    @Column('nvarchar', { name: 'title', nullable: false, length: 255 })
    public title: string;

    @AutoMap()
    @Column('text', { name: 'description', nullable: true })
    public description: string;

    @AutoMap()
    @Column('varchar', { name: "createdBy", nullable: true })
    public createdBy: string;

    @AutoMap()
    @Column('boolean', { name: 'status', nullable: false, default: true })
    public status: boolean;

    @AutoMap()
    @OneToMany(() => ProductMeal, (productMeals) => productMeals.meal, { onDelete: 'CASCADE' })
    public productMeals: ProductMeal[];

    @AutoMap({ typeFn: () => Bird })
    @ManyToOne(() => Bird, (bird) => bird.meals, { onDelete: 'CASCADE' })
    public bird: Bird;

    @AutoMap()
    @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.meal, { onDelete: 'CASCADE' })
    public orderDetails: OrderDetail[];

}