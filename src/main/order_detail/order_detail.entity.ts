import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../base/base.entity";
import { Column, ManyToOne, Entity, OneToMany } from "typeorm";
import Order from "../order/order.entity";
import Meal from "../meal/meal.entity";

@Entity()
export default class OrderDetail extends BaseEntity {

    @AutoMap()
    @Column('int', { name: 'amount', nullable: false, default: 0 })
    public amount: number;

    @AutoMap({ typeFn: () => Order })
    @ManyToOne(() => Order, (order) => order.orderDetails, { onDelete: 'CASCADE' })
    public order: Order;

    @AutoMap({ typeFn: () => Meal })
    @ManyToOne(() => Meal, (meal) => meal.orderDetails, { onDelete: 'CASCADE' })
    public meal: Meal;

}