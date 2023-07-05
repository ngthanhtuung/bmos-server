import { OrderRepository } from './order.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MealCheckDto } from '../meal/dto/meal-check.dto';
import { MealService } from '../meal/meal.service';
import ApiResponse from 'src/shared/res/apiReponse';
import e from 'express';
import Account from '../account/account.entity';
import { OrderCreateDto } from './dto/order-create.dto';
import Meal from '../meal/meal.entity';

@Injectable()
export class OrderService {

    constructor(
        private readonly mealService: MealService,
        private readonly orderRepository: OrderRepository
    ) { }

    async createOrder(order: OrderCreateDto, user: Account): Promise<any | undefined> {
        try {
            const meals = order.meals
            const unavailableProducts = await this.mealService.checkMealAvailability(meals);
            if (unavailableProducts.length !== 0) {
                throw new HttpException(new ApiResponse('Fail', 'Product is not enough', unavailableProducts), HttpStatus.BAD_REQUEST);
            }

            const callback = async (meal: any, amountMeal: number): Promise<any> => {
                return await this.mealService.getTotalPriceOfMeal(meal, amountMeal)
            }
            const result = await this.orderRepository.createOrder(order, user, callback);
            // lafm tiep neu khong co san pham nao thieu thi tao order
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message, err.response.data || undefined), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
