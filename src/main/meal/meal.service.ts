import { ProductMealService } from './../product_meal/product_meal.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MealCreateDto } from './dto/meal-create.dto';
import ApiResponse from 'src/shared/res/apiReponse';
import Meal from './meal.entity';
import { MealRepository } from './meal.repository';
import Account from '../account/account.entity';
import { RoleEnum } from '../role/role.enum';
import { BirdService } from '../bird/bird.service';
import { MealCheckDto } from './dto/meal-check.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class MealService {

    constructor(
        private readonly mealRepository: MealRepository,
        private readonly productMealService: ProductMealService,
        private readonly birdService: BirdService,
        private readonly productService: ProductService
    ) { }

    async getAllMeal(): Promise<any | undefined> {
        try {
            const meals = await this.mealRepository.getAllMeals();
            if (meals) {
                return new ApiResponse('Success', 'Get all meals successfully', meals);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getMealByBird(birdId: string): Promise<any | undefined> {
        try {
            const meals = await this.mealRepository.getMealByBird(birdId);
            if (meals) {
                return new ApiResponse('Success', 'Get all meals successfully', meals);
            } else {
                throw new HttpException(new ApiResponse('Fail', `Not found meal by bird id: ${birdId}`), HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createMeal(data: MealCreateDto, user: Account) {
        try {
            const meal = new Meal();
            meal.title = data.title;
            meal.description = data.description;
            meal.bird = await this.birdService.getBirdById(data.birdId)
            if (user.role.name === RoleEnum.CUSTOMER) {
                meal.createdBy = user.id;
            }
            const newMeal = await this.mealRepository.save(meal);
            if (newMeal) {
                const result = await this.productMealService.insertProductMeal(newMeal.id, data.products);
                if (result) {
                    const response = await this.mealRepository.getMealById(newMeal.id);
                    return new ApiResponse('Success', 'Create meal successfully', response);
                }
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async checkMealAvailability(meals: MealCheckDto[]): Promise<any | undefined> {
        try {
            let unavailableProducts: string[] = []; //List of unavailable products
            for (const meal of meals) {
                const amountMeal = meal.amount; //amount of each meal in order
                const mealCheck = await this.mealRepository.findOne({
                    where: { id: meal.id },
                    relations: ['productMeals', 'productMeals.product']
                }) //Get meal by id
                if (mealCheck) {
                    for (const productMeal of mealCheck.productMeals) { //Loop through each product in meal to check if it is enough
                        if (productMeal.product.remainQuantity < productMeal.amount * amountMeal) {
                            const productName = productMeal.product.productName
                            const mealName = mealCheck.title
                            const message = `Product ${productName} in meal ${mealName} is not enough`
                            unavailableProducts.push(message)
                        }
                    }
                }
            }
            return unavailableProducts;
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
