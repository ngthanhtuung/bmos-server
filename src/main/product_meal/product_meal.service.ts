import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import ProductMealRepository from './product_meal.repository';
import ApiResponse from 'src/shared/res/apiReponse';

@Injectable()
export class ProductMealService {

    constructor(
        private readonly productMealRepository: ProductMealRepository,
    ) { }

    async insertProductMeal(mealId: string, data: any[]): Promise<any | undefined> {
        return await this.productMealRepository.insertProductMeal(mealId, data);
    }

   
}
