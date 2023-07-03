import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../base/base.entity";
import Role from "../role/role.entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { StatusEnum } from "src/shared/status.enum";
import Customer from "../customer/customer.entity";
import Staff from "../staff/staff.entity";

@Entity()
export default class Account extends BaseEntity {

    @AutoMap()
    @Column('nvarchar', { name: "fullName", nullable: false, length: 250 })
    public fullName: string;

    @AutoMap()
    @Column('date', { name: "dob", nullable: true })
    public dob: Date;

    @AutoMap()
    @Column('varchar', { name: 'email', nullable: false, unique: true, })
    public email: string;

    @AutoMap()
    @Column('varchar', { name: 'password', nullable: false })
    public password: string;

    @AutoMap()
    @Column('varchar', {
        name: 'phoneNumber',
        length: 15,
        unique: true,
        nullable: false,
    })
    public phoneNumber: string;

    @AutoMap()
    @Column('varchar', { name: 'avatar', nullable: true, default: 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg' })
    public avatar: string;

    @AutoMap()
    @Column('varchar', { name: 'status', nullable: false, length: 20, default: StatusEnum.UNVERIFIED })
    public status: string

    @AutoMap()
    @Column('varchar', { name: 'refreshToken', nullable: true })
    public refreshToken: string;

    @AutoMap({ typeFn: () => Customer })
    @OneToOne(() => Customer, (customer) => customer.account, { onDelete: 'CASCADE' })
    public customer: Customer;

    @AutoMap({ typeFn: () => Staff })
    @OneToOne(() => Staff, (staff) => staff.account, { onDelete: 'CASCADE' })
    public staff: Staff;

    @AutoMap({ typeFn: () => Role })
    @ManyToOne(() => Role, (role) => role.accounts, { onDelete: 'CASCADE' })
    public role: Role;
}