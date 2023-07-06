import { Repository } from "typeorm";
import Meal from "./meal.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";

@CustomRepository(Meal)
export class MealRepository extends Repository<Meal> {

    async getAllMeals(): Promise<any | undefined> {
        const meal = await this.createQueryBuilder('meal')
            .leftJoinAndSelect('meal.productMeals', 'productMeal')
            .leftJoinAndSelect('productMeal.product', 'product')
            .select([
                'meal.id',
                'meal.title',
                'meal.description',
                'productMeal.amount',
                'product.id',
                'product.productName',
                'product.expiredDate',
                'product.price',
                'product.image',
                'product.status'
            ])
            .where({createdBy: ''})
            .getMany();
        return meal;
    }

    async getMealByBird(birdId: string): Promise<any | undefined> {
        const meal = await this.createQueryBuilder('meal')
            .leftJoinAndSelect('meal.bird', 'bird')
            .leftJoinAndSelect('meal.productMeals', 'productMeal')
            .leftJoinAndSelect('productMeal.product', 'product')
            .select([
                'meal.id',
                'meal.title',
                'meal.description',
                'productMeal.amount',
                'product.id',
                'product.productName',
                'product.expiredDate',
                'product.price',
                'product.image',
                'product.status'
            ])
            .where('bird.id = :birdId', { birdId })
            .getMany();
        return meal;
    }

    async getMealById(mealId: string): Promise<any | undefined> {
        const meal = await this.createQueryBuilder('meal')
            .leftJoinAndSelect('meal.productMeals', 'productMeal')
            .leftJoinAndSelect('productMeal.product', 'product')
            .select([
                'meal.id',
                'meal.title',
                'meal.description',
                'productMeal.amount',
                'product.id',
                'product.productName',
                'product.expiredDate',
                'product.price',
                'product.image',
                'product.status'
            ])
            .where('meal.id = :mealId', { mealId })
            .getOne();
        return meal;
    }
}