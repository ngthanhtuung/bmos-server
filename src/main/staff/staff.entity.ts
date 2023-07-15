import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../base/base.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Account from "../account/account.entity";
import * as moment from 'moment';
import 'moment-timezone';

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
    @Column('datetime', { name: 'registerDate', nullable: true })
    public registerDate: string;

    @BeforeInsert()
    updateRegisterDate() {
        moment.tz.setDefault('Asia/Ho_Chi_Minh');
        const formattedDate = moment().format("YYYY-MM-DD HH:mm:ss");
        this.registerDate = formattedDate;
    }

    @AutoMap()
    @Column('date', { name: 'quitDate', nullable: true })
    public quitDate: Date;

    @AutoMap({ typeFn: () => Account })
    @OneToOne(() => Account, (account) => account.staff, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    public account: Account;

}