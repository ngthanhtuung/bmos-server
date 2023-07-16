import { ProductMealService } from './../product_meal/product_meal.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MealCreateDto } from './dto/meal-create.dto';
import Meal from './meal.entity';
import { MealRepository } from './meal.repository';
import Account from '../account/account.entity';
import { RoleEnum } from '../role/role.enum';
import { BirdService } from '../bird/bird.service';
import { MealCheckDto } from './dto/meal-check.dto';
import { ProductService } from '../product/product.service';
import { MealUpdateDto } from './dto/meal-update.dto';
import ApiResponse from '../../shared/res/apiReponse';
import { MealOrderDto } from './dto/meal-order.dto';

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


    async getAllMealByTitle(title: string): Promise<any | undefined> {
        try {
            const meals = await this.mealRepository.getAllMealsByName(title);
            if (meals) {
                return new ApiResponse('Success', 'Get all meals by title successfully', meals);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllMealByCustomer(userId: string): Promise<any | undefined> {
        try {
            const meals = await this.mealRepository.getAllMealsByCustomer(userId);
            if (meals) {
                return new ApiResponse('Success', 'Get all meals successfully of customer', meals);
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
            meal.image = data.image;
            meal.bird = await this.birdService.getBirdById(data.birdId)
            meal.createdBy = user.role.name === RoleEnum.CUSTOMER ? user.id : '';
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

    async checkMealAvailability(meals: MealOrderDto[]): Promise<any | undefined> {
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

    async getTotalPriceAndUpdateQuantityOfMeal(meal: any, amountMeal: number): Promise<any | undefined> {

        try {
            let totalPrice = 0
            let productInfo = []
            if (meal) {
                for (const productMeal of meal.productMeals) { //Loop through each product in meal to check if it is enough
                    // console.log(`\nProduct ${productMeal.product.id} of meal ${meal.id}`)
                    // console.log(`Price of one product ${productMeal.product.id}: ${productMeal.product.price}`)
                    // console.log(`Amount of product ${productMeal.product.id} of meal ${meal.id}: ${productMeal.amount}`)
                    // console.log(`Product ${productMeal.product.id} remaining: ${productMeal.product.remainQuantity}`)

                    totalPrice += amountMeal * productMeal.amount * productMeal.product.price
                    const newRemainingQuantity = productMeal.product.remainQuantity - (amountMeal * productMeal.amount)
                    const result = await this.productService.updateQuantityProduct(productMeal.product.id, newRemainingQuantity)
                    if (!result) {
                        throw new HttpException(new ApiResponse('Fail', 'Update quantity product failed'), HttpStatus.BAD_REQUEST)
                    }
                    // console.log(`Total Price: ${totalPrice}`)
                    // console.log(`Update remaining quantity of product ${productMeal.product.id}: ${result}`)
                    // console.log(`New remaing quantity of product ${productMeal.product.id}: ${newRemainingQuantity}\n\n`);
                }
            }
            return totalPrice;
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async cancelOrderMeal(meal: any, amountMeal: number): Promise<any | undefined> {
        try {
            if (meal) {
                for (const productMeal of meal.productMeals) {
                    // console.log(`\nProduct ${productMeal.product.id} of meal ${meal.id}`)
                    // console.log(`Price of one product ${productMeal.product.id}: ${productMeal.product.price}`)
                    // console.log(`Amount of product ${productMeal.product.id} of meal ${meal.id}: ${productMeal.amount}`)
                    // console.log(`Product ${productMeal.product.id} remaining: ${productMeal.product.remainQuantity}`)
                    const newRemainingQuantity = productMeal.product.remainQuantity + (amountMeal * productMeal.amount)
                    const result = await this.productService.updateQuantityProduct(productMeal.product.id, newRemainingQuantity)
                    if (!result) {
                        throw new HttpException(new ApiResponse('Fail', 'Update quantity product failed'), HttpStatus.BAD_REQUEST);
                    }
                    // console.log(`Update remaining quantity of product ${productMeal.product.id}: ${result}`)
                    // console.log(`New remaing quantity of product ${productMeal.product.id}: ${newRemainingQuantity}\n\n`);
                }
                return true;
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateMeal(data: MealUpdateDto, user: Account) {
        try {
            const checkExistMeal = await this.mealRepository.getMealById(data.id);
            console.log("user:", user);

            console.log("checkExistMeal:", checkExistMeal);
            // Check meals exist
            if (checkExistMeal) {
                if (user.role.name === RoleEnum.CUSTOMER) {
                    // Check create by user
                    if (user.id !== checkExistMeal.createdBy) {
                        throw new HttpException(new ApiResponse('Fail', 'Meals do not belong to the user!!!'), HttpStatus.BAD_REQUEST)
                    }
                }
                // check bird
                const bird = await this.birdService.getBirdById(data.birdId)
                if (!bird) {
                    throw new HttpException(new ApiResponse('Fail', 'Bird do not exist!!!'), HttpStatus.NOT_FOUND)
                }
                const meal: MealUpdateDto = {
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    birdId: bird.id,
                    image: data.image,
                    id: data.id,
                    products: data.products
                }
                const newMealUpdate = await this.mealRepository.updateMeal(meal);
                console.log("newMealUpdate:", newMealUpdate);
                if (newMealUpdate) {
                    // delete meal in product_meals
                    const flagCheckDelete = await this.productMealService.deleteProductMeal(newMealUpdate.id);
                    console.log("flagCheckDelete:", flagCheckDelete);
                    if (flagCheckDelete) {
                        await this.productMealService.insertProductMeal(newMealUpdate.id, data.products);
                        const response = await this.mealRepository.getMealById(newMealUpdate.id);
                        return new ApiResponse('Success', 'Update meal successfully', response);
                    }
                }
            } else {
                throw new HttpException(new ApiResponse('Fail', 'Meals do not exist!!!'), HttpStatus.NOT_FOUND)
            }

        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getMealDetail(mealId: string): Promise<any | undefined> {
        try {
            const meal = await this.mealRepository.getMealById(mealId);
            if (meal) {
                return new ApiResponse('Success', 'Get details meals successfully', meal);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getCountMeal(): Promise<any | number> {
        return await this.mealRepository.getCountMeal();
    }

}

