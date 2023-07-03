import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Account from "../account/account.entity";
import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../base/base.entity";


@Entity()
export default class Customer extends BaseEntity {

    @AutoMap()
    @Column('int', { name: 'point', nullable: false, default: 0 })
    public point: number;

    @AutoMap({ typeFn: () => Account })
    @OneToOne(() => Account, (account) => account.customer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public account: Account;
}