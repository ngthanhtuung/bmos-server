import { Repository } from "typeorm";
import Meal from "./meal.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { MealUpdateDto } from "./dto/meal-update.dto";

@CustomRepository(Meal)
export class MealRepository extends Repository<Meal> {

    groupByKey(array: any, key: string) {
        return array
            .reduce((hash: any, obj: any) => {
                if (obj[key] === undefined) return hash;
                return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
            }, {})
    }

    async getAllMeals(): Promise<any | undefined> {
        let meal = await this.createQueryBuilder('meal')
            .leftJoinAndSelect('meal.productMeals', 'productMeal')
            .leftJoinAndSelect('productMeal.product', 'product')
            .select([
                'meal.id',
                'meal.title',
                'meal.description',
                'meal.image',
                'productMeal.amount',
                'productMeal.section',
                'product.id',
                'product.productName',
                'product.expiredDate',
                'product.price',
                'product.image',
                'product.status'
            ])
            .where({
                createdBy: ''
            })
            .getMany();
        const productList = meal.map(p => p.productMeals).flat();
        const productGroupBySection = this.groupByKey(productList, 'section')
        console.log("productGroupBySection:", productGroupBySection);
        meal.map(i => {
            i.productMeals = productGroupBySection
        })
        return meal;
    }

    async getAllMealsByName(name: string): Promise<any | undefined> {
        const query = `SELECT * FROM meal WHERE title like '%${name}%';`
        const meal = await this.query(query)
        return meal;
    }

    async getAllMealsByCustomer(userId: string): Promise<any | undefined> {
        const meal = await this.createQueryBuilder('meal')
            .leftJoinAndSelect('meal.bird', 'bird')
            .leftJoinAndSelect('meal.productMeals', 'productMeal')
            .leftJoinAndSelect('productMeal.product', 'product')
            .select([
                'meal.id',
                'meal.title',
                'meal.description',
                'meal.image',
                'productMeal.amount',
                'product.id',
                'product.productName',
                'product.expiredDate',
                'product.price',
                'product.image',
                'product.status'
            ])
            .where('createdBy = :userId', { userId })
            .getMany();
        return meal;
    }

    async getMealByBird(birdId: string): Promise<any | undefined> {
        let meal = await this.createQueryBuilder('meal')
            .leftJoinAndSelect('meal.bird', 'bird')
            .leftJoinAndSelect('meal.productMeals', 'productMeal')
            .leftJoinAndSelect('productMeal.product', 'product')
            .select([
                'meal.id',
                'meal.title',
                'meal.description',
                'meal.image',
                'productMeal.amount',
                'productMeal.section',
                'product.id',
                'product.productName',
                'product.expiredDate',
                'product.price',
                'product.image',
                'product.status'
            ])
            .where('bird.id = :birdId', { birdId })
            .getMany();
        const productList = meal.map(p => p.productMeals).flat();
        const productGroupBySection = this.groupByKey(productList, 'section')
        console.log("productGroupBySection:", productGroupBySection);
        meal.map(i => {
            i.productMeals = productGroupBySection
        })
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
                'meal.createdBy',
                'meal.status',
                'meal.image',
                'productMeal.amount',
                'productMeal.section',
                'product.id',
                'product.productName',
                'product.expiredDate',
                'product.price',
                'product.image',
                'product.status'
            ])
            .where('meal.id = :mealId', { mealId })
            .getOne();
        const productList = meal.productMeals;
        const productGroupBySection = this.groupByKey(productList, 'section')
        console.log("productGroupBySection:", productGroupBySection);
        meal.productMeals = productGroupBySection
        return meal;
    }

    async updateMeal(data: MealUpdateDto): Promise<any | undefined> {
        try {
            const updated = await this.createQueryBuilder()
                .update(Meal)
                .set({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    image: data.image
                })
                .where('id = :id', { id: data.id })
                .execute();
            if (updated.affected > 0) {
                const meal = await this.findOne({
                    where: { id: data.id }
                });
                return meal;
            }
        } catch (err) {
            return null;
        }
    }

    async getCountMeal(): Promise<any | undefined> {
        try {
            const result = await this.createQueryBuilder('meal')
                .where('createdBy = :id', { id: '' })
                .getCount();
            return result
        } catch (err) {
            return null;
        }
    }
}