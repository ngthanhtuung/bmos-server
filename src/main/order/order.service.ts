import { CustomerService } from './../customer/customer.service';
import { OrderRepository } from './order.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MealCheckDto } from '../meal/dto/meal-check.dto';
import { MealService } from '../meal/meal.service';
import ApiResponse from 'src/shared/res/apiReponse';
import Account from '../account/account.entity';
import { OrderCreateDto } from './dto/order-create.dto';
import Meal from '../meal/meal.entity';
import { DeliveryService } from '../delivery/delivery.service';
import { SharedService } from 'src/shared/shared.service';
import { TransactionService } from '../transaction/transaction.service';
import { PaymentService } from '../payment/payment.service';
import { OrderStatusEnum } from './order-status.enum';
import Order from './order.entity';

@Injectable()
export class OrderService {

    constructor(
        private readonly mealService: MealService,
        private readonly orderRepository: OrderRepository,
        private readonly deliveryService: DeliveryService,
        private readonly transactionService: TransactionService,
        private readonly paymentService: PaymentService,
    ) { }


    async getAllOrders(status: OrderStatusEnum): Promise<any | undefined> {
        try {
            const orders = await this.orderRepository.getAllOrder(status);
            if (orders) {
                return orders;
            }
            throw new HttpException(new ApiResponse('Fail', `Don't have any order`), HttpStatus.NOT_FOUND)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllOrderByCustomer(user: Account, status: OrderStatusEnum): Promise<any | undefined> {
        try {
            const orders = await this.orderRepository.getOrderByCustomer(user.id, status)
            if (orders) {
                return orders;
            }
            throw new HttpException(new ApiResponse('Fail', `You don't have any order. Let's try to order! `), HttpStatus.NOT_FOUND)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getOrderDetail(orderId: string): Promise<any | undefined> {
        try {
            const order = await this.orderRepository.getOrderDetail(orderId);
            if (order) {
                return order;
            }
            throw new HttpException(new ApiResponse('Fail', 'Order not found'), HttpStatus.NOT_FOUND)
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
                return await this.mealService.getTotalPriceAndUpdateQuantityOfMeal(meal, amountMeal)
            }
            const orderResult = await this.orderRepository.createOrder(order, user, callback);
            // const fullAddress = await this.deliveryService.createFullAddress(order.shippingProvinceCode, order.shippingDistrictCode, order.shippingWardCode);
            // orderResult.shippingAddress = orderResult.shippingAddress + ", " + fullAddress
            // await this.orderRepository.save(orderResult);
            if (orderResult) {
                let response = orderResult;
                let ghnResponse;
                // if (order.paymentType === 'MOMO') {
                //     ghnResponse = await this.deliveryService.createOrder(orderResult, false);
                // } else {
                //     ghnResponse = await this.deliveryService.createOrder(orderResult, true, order.shippingFee);
                // }
                // if (ghnResponse != undefined) {
                //     orderResult.orderCode = ghnResponse.data.order_code
                //     orderResult.orderUrl = `https://tracking.ghn.dev/?order_code=${ghnResponse.data.order_code}`
                //     await this.orderRepository.save(orderResult);
                //     //cho switch
                //     return new ApiResponse('Success', 'Create order successfully', response);
                // } else {
                //     await this.rollbackOrder(orderResult.id)
                //     throw new HttpException(new ApiResponse('Fail', 'Create order fail'), HttpStatus.INTERNAL_SERVER_ERROR)
                // }
                switch (order.paymentType) {
                    case 'MOMO':
                        const paymentResult = await this.paymentService.createPayment(orderResult)
                        if (paymentResult !== undefined) {
                            response = {
                                ...orderResult,
                                paymentUrl: paymentResult
                            }
                        }
                        break;
                    case 'COD':
                        const transactionResult = await this.transactionService.createTransaction(orderResult, 'COD');
                        if (transactionResult !== undefined) {
                            orderResult.orderStatus = OrderStatusEnum.CONFIRMED
                            const result = await this.orderRepository.save(orderResult)
                            response = {
                                ...result
                            }
                        }
                        break;
                }
                return new ApiResponse('Success', 'Create order successfully', response);
            }
            throw new HttpException(new ApiResponse('Fail', 'Create order fail'), HttpStatus.INTERNAL_SERVER_ERROR)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message, err.response.data || undefined), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async cancelOrder(orderId: string, user: Account): Promise<any | undefined> {
        try {
            const cancelOrder = await this.orderRepository.findOne({
                where: { id: orderId },
                relations: ['orderDetails', 'orderDetails.meal', 'orderDetails.meal.productMeals', 'orderDetails.meal.productMeals.product']
            })
            if (cancelOrder) {
                if (cancelOrder.orderStatus === OrderStatusEnum.CREATED || cancelOrder.orderStatus === OrderStatusEnum.CONFIRMED) {
                    const callback = async (meal: any, amountMeal: number): Promise<any> => {
                        return await this.mealService.cancelOrderMeal(meal, amountMeal)
                    }
                    const result = await this.orderRepository.cancelOrder(cancelOrder, callback);
                    if (result) {
                        const response = await this.deliveryService.cancelOrder(cancelOrder.orderCode);
                        // const refundPayment = await this.paymentService.refundPayment(cancelOrder);
                        if (response == 200) {
                            return new ApiResponse('Success', `Cancel order #${cancelOrder.id} successfully`);
                        }
                    } else {
                        throw new HttpException(new ApiResponse('Fail', `Cancel order #${cancelOrder.id} failed`), HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                } else {
                    throw new HttpException(new ApiResponse('Fail', `Order #${orderId} is delivering, can't cancel`), HttpStatus.BAD_REQUEST);
                }
            }
            throw new HttpException(new ApiResponse('Fail', `Order #${orderId} not found`), HttpStatus.NOT_FOUND);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private async rollbackOrder(orderId: string): Promise<any | undefined> {
        try {
            const cancelOrder = await this.orderRepository.findOne({
                where: { id: orderId },
                relations: ['orderDetails', 'orderDetails.meal', 'orderDetails.meal.productMeals', 'orderDetails.meal.productMeals.product']
            })
            if (cancelOrder) {
                const callback = async (meal: any, amountMeal: number): Promise<any> => {
                    return await this.mealService.cancelOrderMeal(meal, amountMeal)
                }
                const result = await this.orderRepository.rollBackOrder(cancelOrder, callback);
                return result
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getOrder(orderId: string): Promise<Order | undefined> {
        try {
            const order = await this.orderRepository.findOne({
                where: { id: orderId }
            })
            return order;
        } catch (err) {
            return undefined
        }
    }

    async updateOrderStatus(orderId: string, status: OrderStatusEnum): Promise<any | undefined> {
        try {
            const order = await this.getOrder(orderId);
            if (order) {
                order.orderStatus = status;
                const result = await this.orderRepository.save(order);
                return result ? true : false;
            }
            return false;
        } catch (err) {
            console.log('Error at updateOrderStatus: ', err.message);
            return false;
        }
    }

    async updateDelivery(orderId: string): Promise<any | undefined> {
        return await this.orderRepository.updateDelivery(orderId);
    }

    async updateComplete(orderId: string): Promise<any | undefined> {
        return await this.orderRepository.updateComplete(orderId);
    }

    async getCountOrder(status: OrderStatusEnum): Promise<any | undefined> {
        return await this.orderRepository.getCountOrder(status);
    }

    async getProfitByYear(year: number): Promise<any | undefined> {
        return await this.orderRepository.getProfitByYear(year);
    }
}
