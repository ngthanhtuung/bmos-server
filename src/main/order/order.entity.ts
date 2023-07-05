import { AutoMap } from "@automapper/classes";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { OrderStatusEnum } from "./order-status.enum";
import Customer from "../customer/customer.entity";
import OrderDetail from "../order_detail/order_detail.entity";
import { BaseEntity } from "../base/base.entity";


@Entity()
export default class Order extends BaseEntity {


    @AutoMap()
    @Column('nvarchar', { name: 'name', nullable: false })
    public name: string;

    @AutoMap()
    @Column('nvarchar', { name: 'phone', nullable: false })
    public phone: string;

    @AutoMap()
    @Column('date', { name: 'orderDate', nullable: false })
    public orderDate: Date;

    @BeforeInsert()
    setDefaultOrderDate() {
        this.orderDate = new Date();
    }
    
    @AutoMap()
    @Column('double', { name: 'totalPrice', nullable: false, default: 0 })
    public totalPrice: number;

    @AutoMap()
    @Column('varchar', { name: 'shippingAddress', nullable: false, default: '' })
    public shippingAddress: string;

    @AutoMap()
    @Column('varchar', { name: 'shippingWardCode', nullable: false, })
    public shippingWardCode: string;

    @AutoMap()
    @Column('int', { name: 'shippingDistrictCode', nullable: false, })
    public shippingDistrictCode: number;

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