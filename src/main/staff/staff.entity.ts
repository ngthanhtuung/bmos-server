import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../base/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Account from "../account/account.entity";

@Entity()
export default class Staff extends BaseEntity {

    @AutoMap()
    @Column('varchar', {
        name: 'identityNumber',
        nullable: false,
        unique: true,
        length: 12
    })
    public identityNumber: string;

    @AutoMap()
    @Column('date', { name: 'registerDate', nullable: true })
    public registerDate: Date;

    @AutoMap()
    @Column('date', { name: 'quitDate', nullable: true })
    public quitDate: Date;

    @AutoMap({ typeFn: () => Account })
    @OneToOne(() => Account, (account) => account.staff, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public account: Account;

}