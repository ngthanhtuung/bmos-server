import { AutoMap } from "@automapper/classes";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { OrderStatusEnum } from "./order-status.enum";
import Customer from "../customer/customer.entity";
import OrderDetail from "../order_detail/order_detail.entity";
import { BaseEntity } from "../base/base.entity";


@Entity()
export default class Order extends BaseEntity {

    @AutoMap()
    @Column('date', { name: 'orderDate', nullable: false })
    public orderDate: Date;

    @AutoMap()
    @Column('double', { name: 'totalPrice', nullable: false, default: 0 })
    public totalPrice: number;

    @AutoMap()
    @Column('varchar', { name: 'orderStatus', nullable: false, default: OrderStatusEnum.CREATED })
    public orderStatus: OrderStatusEnum;

    @AutoMap()
    @Column('text', { name: 'orderUrl', nullable: true })
    public orderUrl: string;

    @AutoMap({ typeFn: () => Customer })
    @ManyToOne(() => Customer, (customer) => customer.orders, { onDelete: 'CASCADE' })
    public customer: Customer;

    @AutoMap()
    @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, { onDelete: 'CASCADE' })
    public orderDetails: OrderDetail[];
}