import { AutoMap } from "@automapper/classes";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Account from "../account/account.entity";

@Entity()
export default class Role {

    @AutoMap()
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    public id: number;

    @AutoMap()
    @Column('varchar', { name: 'name', length: 10, nullable: false, unique: true })
    public name: string;

    @AutoMap()
    @OneToMany(() => Account, (account) => account.role, { onDelete: 'CASCADE' })
    public accounts: Account[];
}