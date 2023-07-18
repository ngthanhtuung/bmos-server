import { BirdService } from './../bird/bird.service';
import { Repository } from "typeorm";
import Meal from "./meal.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { MealUpdateDto } from "./dto/meal-update.dto";
import { isEmail, isEmpty } from 'class-validator';
import Account from '../account/account.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import ApiResponse from 'src/shared/res/apiReponse';
import { RoleEnum } from '../role/role.enum';

@CustomRepository(Meal)
export class MealRepository extends Repository<Meal> {

    handleSectionProduct(meal: any) {
        const productList = meal.map((p: any) => p.productMeals).flat();
        const sectionProduct = {
            "Morning": [],
            "Afternoon": [],
            "Evening": [],
        }
        productList?.forEach((productMeal: any) => {
            productMeal.section?.forEach((s: string) => {
                switch (s) {
                    case "Morning":
                        sectionProduct['Morning'].push(productMeal)
                        break;
                    case "Afternoon":
                        sectionProduct['Afternoon'].push(productMeal)
                        break;
                    default:
                        sectionProduct['Evening'].push(productMeal)
                        break;
                }
            })
        });
        return sectionProduct
    }

    async getAllMeals(user: Account): Promise<any | undefined> {
        const roleName = user.role.name;
        let query = await this.createQueryBuilder('meal')
            .leftJoinAndSelect('meal.bird', 'bird')
            .leftJoinAndSelect('meal.productMeals', 'productMeal')
            .leftJoinAndSelect('productMeal.product', 'product')
            .select([
                'meal.id',
                'meal.title',
                'meal.description',
                'meal.image',
                'meal.status',
                'bird.id',
                'productMeal.amount',
                'productMeal.section',
                'product.id',
                'product.productName',
                'product.expiredDate',
                'product.price',
                'product.image',
                'product.status'
            ])
        if (roleName === RoleEnum.CUSTOMER) {
            query = query.where({
                createdBy: ''
            })
                .andWhere({
                    status: true
                })
        } else {
            query = query.where({
                createdBy: ''
            })
        }
        const meal = await query.getMany();

        meal.map((i: any) => {
            i.productMeals = this.handleSectionProduct(meal)
        })
        return meal;
    }

    async getAllMealsByName(title: string, idBird: string): Promise<any | undefined> {
        console.log("title:", title);
        console.log("idBird:", idBird);
        let query = `SELECT * FROM meal `
        if (title !== undefined && idBird !== undefined) {
            query += `WHERE birdId = '${idBird}' AND title like '%${title}%'`
        } else if (idBird !== undefined) {
            query += `WHERE birdId = '${idBird}'`
        } else if (title !== undefined) {
            query += `WHERE title like '%${title}%'`
        }
        const meal = await this.query(query)
        return meal;
    }

    async getAllMealsByCustomer(userId: string): Promise<any | undefined> {
        let meal = await this.createQueryBuilder('meal')
            .leftJoinAndSelect('meal.bird', 'bird')
            .leftJoinAndSelect('meal.productMeals', 'productMeal')
            .leftJoinAndSelect('productMeal.product', 'product')
            .select([
                'meal.id',
                'meal.title',
                'meal.description',
                'meal.image',
                'bird.id',
                'productMeal.amount',
                'productMeal.section',
                'product.id',
                'product.productName',
                'product.expiredDate',
                'product.price',
                'product.image',
                'product.status'
            ])
            .where('createdBy = :userId', { userId })
            .andWhere({
                status: true
            })
            .getMany();
        meal.map((i: any) => {
            i.productMeals = this.handleSectionProduct(meal)
        })
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
                'meal.birdId',
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
        meal.map((i: any) => {
            i.productMeals = this.handleSectionProduct(meal)
        })
        return meal;
    }

    async getMealById(mealId: string): Promise<any | undefined> {
        const meal: any = await this.createQueryBuilder('meal')
            .leftJoinAndSelect('meal.bird', 'bird')
            .leftJoinAndSelect('meal.productMeals', 'productMeal')
            .leftJoinAndSelect('productMeal.product', 'product')
            .select([
                'meal.id',
                'meal.title',
                'meal.description',
                'meal.createdBy',
                'meal.status',
                'meal.image',
                'bird.id',
                'bird.birdName',
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
        meal.productMeals = this.handleSectionProduct([meal]);
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

    async updateMealStatus(mealId: string, user: Account): Promise<any | undefined> {
        const roleName = user.role.name;
        try {
            const meal = await this.findOne({
                where: { id: mealId }
            });
            if (meal) {
                if (roleName === RoleEnum.CUSTOMER) {
                    if (meal.createdBy === user.id) {
                        const updated = await this.createQueryBuilder()
                            .update(Meal)
                            .set({
                                status: !meal.status
                            })
                            .where('id = :id', { id: mealId })
                            .execute();
                        if (updated.affected > 0) {
                            return new ApiResponse('Success', `${meal.status ? 'Disable' : 'Enable'} meal successfully`);
                        }
                        throw new HttpException(new ApiResponse('Fail', 'Delete meal fail!'), HttpStatus.BAD_REQUEST)
                    } else {
                        throw new HttpException(new ApiResponse('Fail', 'You are not allowed to delete this meal'), HttpStatus.BAD_REQUEST)
                    }
                } else {
                    if (meal.createdBy === '') {
                        const updated = await this.createQueryBuilder()
                            .update(Meal)
                            .set({
                                status: !meal.status
                            })
                            .where('id = :id', { id: mealId })
                            .execute();
                        if (updated.affected > 0) {
                            return new ApiResponse('Success', `${meal.status ? 'Disable' : 'Enable'} meal successfully`);
                        }
                        throw new HttpException(new ApiResponse('Fail', 'Delete meal fail!'), HttpStatus.BAD_REQUEST)
                    } else {
                        throw new HttpException(new ApiResponse('Fail', 'You are not allowed to delete this meal'), HttpStatus.BAD_REQUEST)
                    }
                }
            }
            throw new HttpException(new ApiResponse('Fail', 'Meal not found'), HttpStatus.NOT_FOUND)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
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