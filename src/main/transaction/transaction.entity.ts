import { BeforeInsert, Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { AutoMap } from "@automapper/classes";
import * as moment from 'moment';
import 'moment-timezone';
import Order from "../order/order.entity";


@Entity()
export default class Transaction extends BaseEntity {

    @AutoMap()
    @Column('datetime', { name: 'paymentTime', nullable: false })
    paymentTime: string;

    @BeforeInsert()
    updatePaymentTime() {
        moment.tz.setDefault('Asia/Ho_Chi_Minh');
        const formattedDate = moment().format("YYYY-MM-DD HH:mm:ss");
        this.paymentTime = formattedDate;
    }

    @AutoMap()
    @Column('varchar', { name: 'paymentType', nullable: false })
    paymentType: string;

    @AutoMap({ typeFn: () => Order })
    @ManyToOne(() => Order, (order) => order.transactions, { onDelete: 'CASCADE' })
    public order: Order

}