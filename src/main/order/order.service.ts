import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MealCheckDto } from '../meal/dto/meal-check.dto';
import { MealService } from '../meal/meal.service';
import ApiResponse from 'src/shared/res/apiReponse';
import e from 'express';

@Injectable()
export class OrderService {

    constructor(
        private readonly mealService: MealService,
    ) { }

    async createOrder(meals: MealCheckDto[]): Promise<any | undefined> {
        try {
            const unavailableProducts = await this.mealService.checkMealAvailability(meals);
            if (unavailableProducts.length !== 0) {
                throw new HttpException(new ApiResponse('Fail', 'Product is not enough', unavailableProducts), HttpStatus.BAD_REQUEST);
            } 
            // lafm tiep neu khong co san pham nao thieu thi tao order
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message, err.response.data || undefined), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
