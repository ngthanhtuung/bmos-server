import { AutoMap } from '@automapper/classes';
import Meal from '../meal/meal.entity';
import Product from '../product/product.entity';
import { BaseEntity } from './../base/base.entity';
import { Column, ManyToOne, Entity } from 'typeorm';

@Entity()
export default class ProductMeal extends BaseEntity {

    @AutoMap()
    @Column('int', { name: 'amount', nullable: false, default: 1 })
    public amount: number;
    @AutoMap()
    @Column('json', { name: 'section', nullable: false })
    public section: Array<string>
    @AutoMap()
    @ManyToOne(() => Product, (product) => product.productMeals, { onDelete: 'CASCADE' })
    public product: Product;

    @AutoMap()
    @ManyToOne(() => Meal, (meal) => meal.productMeals, { onDelete: 'CASCADE' })
    public meal: Meal;
}