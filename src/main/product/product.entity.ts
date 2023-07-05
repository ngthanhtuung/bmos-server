import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../base/base.entity";
import Category from "../product_category/category.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import ProductMeal from "../product_meal/product_meal.entity";

@Entity()
export default class Product extends BaseEntity {

    @AutoMap()
    @Column('nvarchar', { name: 'productName', nullable: false })
    public productName: string;

    @AutoMap()
    @Column('text', { name: 'description', nullable: false })
    public description: string;

    @AutoMap()
    @Column('date', { name: "expiredDate", nullable: true })
    public expiredDate: Date;

    @AutoMap()
    @Column('double', { name: 'price', nullable: false, default: 0 })
    public price: number;

    @AutoMap()
    @Column('nvarchar', { name: 'image', nullable: true })
    public image: string;

    @AutoMap()
    @Column('int', { name: 'remainQuantity', nullable: false, default: 0 })
    public remainQuantity: number;

    @AutoMap()
    @Column('boolean', { name: 'status', nullable: false, default: true })
    public status: boolean;

    @AutoMap({ typeFn: () => Category })
    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
    public category: Category;

    @AutoMap()
    @OneToMany(() => ProductMeal, (productMeals) => productMeals.product, { onDelete: 'CASCADE' })
    public productMeals: ProductMeal[];
}