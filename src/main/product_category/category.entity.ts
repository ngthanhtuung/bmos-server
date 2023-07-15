import { AutoMap } from "@automapper/classes";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Product from "../product/product.entity";

@Entity()
export default class Category {

    @AutoMap()
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    public id: number;

    @AutoMap()
    @Column('nvarchar', { name: 'name', nullable: false })
    public name: string;

    @AutoMap()
    @Column('boolean', { name: 'status', nullable: false, default: true })
    public status: boolean;

    @AutoMap()
    @OneToMany(() => Product, (product) => product.category, { onDelete: 'CASCADE' })
    public products: Product[];
}