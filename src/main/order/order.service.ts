import { CustomerService } from './../customer/customer.service';
import { OrderRepository } from './order.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MealCheckDto } from '../meal/dto/meal-check.dto';
import { MealService } from '../meal/meal.service';
import ApiResponse from 'src/shared/res/apiReponse';
import e from 'express';
import Account from '../account/account.entity';
import { OrderCreateDto } from './dto/order-create.dto';
import Meal from '../meal/meal.entity';
import { DeliveryService } from '../delivery/delivery.service';

@Injectable()
export class OrderService {

    constructor(
        private readonly mealService: MealService,
        private readonly customerService: CustomerService,
        private readonly orderRepository: OrderRepository,
        private readonly deliveryService: DeliveryService
    ) { }

    async getAllOrder(user: Account): Promise<any | undefined> {
        try {
            const orders = await this.orderRepository.find({
                where: { customer: { account: { id: user.id } } }
            })
            return new ApiResponse('Success', 'Get all order successfully', orders);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

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
            const orderResult = await this.orderRepository.createOrder(order, user, callback);
            console.log("result in service:", orderResult);
            if (orderResult) {
                const response = await this.deliveryService.createOrder(orderResult)
                console.log("response in service order:", response);
                if (response != undefined) {
                    orderResult.orderCode = response.data.order_code
                    orderResult.orderUrl = `https://tracking.ghn.dev/?order_code=${response.data.order_code}`
                    await this.orderRepository.save(orderResult);
                    return new ApiResponse('Success', 'Create order successfully', orderResult);
                } else {
                    await this.cancelOrder(orderResult.id)
                    return new ApiResponse('Fail', 'Create order fail');
                }
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message, err.response.data || undefined), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async cancelOrder(orderId: string): Promise<any | undefined> {
        try {
            const cancelOrder = await this.orderRepository.findOne({
                where: { id: orderId },
                relations: ['orderDetails', 'orderDetails.meal', 'orderDetails.meal.productMeals', 'orderDetails.meal.productMeals.product']
            })
            if (cancelOrder) {
                const callback = async (meal: any, amountMeal: number): Promise<any> => {
                    return await this.mealService.cancelOrderMeal(meal, amountMeal)
                }
                const result = await this.orderRepository.cancelOrder(cancelOrder, callback);
                return result
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}
