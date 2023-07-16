import { ProductMealService } from './../product_meal/product_meal.service';
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import Order from "./order.entity";
import { Repository } from "typeorm";
import { OrderCreateDto } from "./dto/order-create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import Meal from '../meal/meal.entity';
import Account from '../account/account.entity';
import { OrderStatusEnum } from './order-status.enum';
import ApiResponse from 'src/shared/res/apiReponse';

@CustomRepository(Order)
export class OrderRepository extends Repository<Order> {

    async getAllOrder(status: OrderStatusEnum): Promise<any | undefined> {
        try {
            const query = await this.createQueryBuilder('order')
                .leftJoinAndSelect('order.transactions', 'transaction')
                .leftJoin('order.customer', 'customer')
                .leftJoinAndSelect('order.orderDetails', 'orderDetails')
                .leftJoinAndSelect('orderDetails.meal', 'meal')
                .leftJoinAndSelect('meal.productMeals', 'productMeals')
                .leftJoinAndSelect('productMeals.product', 'product')
                .select([
                    'order.id',
                    'order.name',
                    'order.phone',
                    'order.orderDate',
                    'order.shippingAddress',
                    'order.orderCode',
                    'order.totalPrice',
                    'order.orderUrl',
                    'order.orderStatus',
                    'transaction.paymentType',
                    'orderDetails.amount',
                    'meal.id',
                    'meal.title',
                    'meal.description',
                    'meal.image',
                    'productMeals.id',
                    'productMeals.amount',
                    'product.id',
                    'product.productName',
                    'product.description',
                    'product.image',
                    'product.expiredDate',
                    'product.price',
                    'product.remainQuantity'
                ])
            if (status !== undefined) {
                query.where('order.orderStatus = :status', { status: status })
            }
            const order = await query.getMany();
            return new ApiResponse('Success', 'Get all order successfully', order);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getOrderByCustomer(id: string, status: OrderStatusEnum): Promise<any | undefined> {
        try {
            const query = await this.createQueryBuilder('order')
                .leftJoinAndSelect('order.transactions', 'transaction')
                .leftJoin('order.customer', 'customer')
                .leftJoinAndSelect('order.orderDetails', 'orderDetails')
                .leftJoinAndSelect('orderDetails.meal', 'meal')
                .leftJoinAndSelect('meal.productMeals', 'productMeals')
                .leftJoinAndSelect('productMeals.product', 'product')
                .where('customer.userId = :id', { id: id })
                .select([
                    'order.id',
                    'order.name',
                    'order.phone',
                    'order.orderDate',
                    'order.shippingAddress',
                    'order.orderCode',
                    'order.totalPrice',
                    'order.orderUrl',
                    'order.orderStatus',
                    'transaction.paymentType',
                    'orderDetails.amount',
                    'meal.id',
                    'meal.title',
                    'meal.description',
                    'meal.image',
                    'productMeals.id',
                    'productMeals.amount',
                    'product.id',
                    'product.productName',
                    'product.description',
                    'product.image',
                    'product.expiredDate',
                    'product.price',
                    'product.remainQuantity'
                ])
            if (status !== undefined) {
                query.where('order.orderStatus = :status', { status: status })
            }
            const order = await query.getMany();
            return new ApiResponse('Success', 'Get all order successfully', order);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getOrderDetail(orderId: string): Promise<any | undefined> {
        try {
            const order = await this.createQueryBuilder('order')
                .leftJoinAndSelect('order.transactions', 'transaction')
                .leftJoin('order.customer', 'customer')
                .leftJoinAndSelect('order.orderDetails', 'orderDetails')
                .leftJoinAndSelect('orderDetails.meal', 'meal')
                .leftJoinAndSelect('meal.productMeals', 'productMeals')
                .leftJoinAndSelect('productMeals.product', 'product')
                .where('order.id = :orderId', { orderId: orderId })
                .select([
                    'order.id',
                    'order.name',
                    'order.phone',
                    'order.orderDate',
                    'order.shippingAddress',
                    'order.orderCode',
                    'order.totalPrice',
                    'order.orderUrl',
                    'order.orderStatus',
                    'transaction.paymentType',
                    'orderDetails.amount',
                    'meal.id',
                    'meal.title',
                    'meal.description',
                    'meal.image',
                    'productMeals.id',
                    'productMeals.amount',
                    'product.id',
                    'product.productName',
                    'product.description',
                    'product.image',
                    'product.expiredDate',
                    'product.price',
                    'product.remainQuantity'
                ])
                .getOne()
            return new ApiResponse('Success', 'Get all order successfully', order);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateDelivery(orderId: string): Promise<any | undefined> {
        try {
            const order = await this.findOne({
                where: { id: orderId }
            })
            if (!order) {
                throw new HttpException(new ApiResponse('Fail', 'Order not found'), HttpStatus.NOT_FOUND)
            }
            order.orderStatus = OrderStatusEnum.DELIVERING;
            await this.save(order);
            return new ApiResponse('Success', `Order #${order.id} is now delivering`, order);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateComplete(orderId: string): Promise<any | undefined> {
        try {
            const order = await this.findOne({
                where: { id: orderId }
            })
            if (!order) {
                throw new HttpException(new ApiResponse('Fail', 'Order not found'), HttpStatus.NOT_FOUND)
            }
            order.orderStatus = OrderStatusEnum.COMPLETED;
            await this.save(order);
            return new ApiResponse('Success', `Order #${order.id} is now delivering`, order);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createOrder(
        data: OrderCreateDto,
        user: any,
        fn: (meal: any, amountMeal: number) => Promise<any>
    ): Promise<any | undefined> {
        const queryRunner = this.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');
        try {
            const account = await this.manager.findOne('Account', {
                where: { id: user.id }
            })
            const customer = await this.manager.findOne('Customer', {
                where: { account: account }
            }) //Finding customer to create order
            const order = await queryRunner.manager.save( //Creating order
                queryRunner.manager.create('Order', {
                    name: data.name,
                    phone: data.phone,
                    shippingAddress: data.shippingAddress,
                    shippingWardCode: data.shippingWardCode,
                    shippingDistrictCode: data.shippingDistrictCode,
                    totalPrice: 0,
                    orderCode: '',
                    customer: customer,
                })
            )
            const meals = data.meals; //By the following data assign, have array object meals=[{ "id", "amount" }], get this to prepare create order detail
            let totalPriceOrder = 0;
            for (let i = 0; i < meals.length; i++) {
                const amountMeal = meals[i].amount; //Get how many meal want to order
                const meal = await queryRunner.manager.findOne('Meal', {
                    where: { id: meals[i].id },
                    relations: ['productMeals', 'productMeals.product']
                }) //Get meal to create order detail
                let totalPrice = await fn(meal, amountMeal); //After finding Meal, we will call a callback function to calculate the total price of the meal from orderMealService because Order doesn't have any relationship directly with the Product
                totalPriceOrder += totalPrice;
                await queryRunner.manager.save(
                    queryRunner.manager.create('OrderDetail', {
                        amount: amountMeal,
                        totalPrice: totalPrice,
                        order: order,
                        meal: meal,
                    })
                )
            }
            order.totalPrice = (totalPriceOrder * 24000) + data.shippingFee;
            await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();
            return order;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            queryRunner.release();
        }
    }

    async cancelOrder(
        cancelOrder: any,
        fn: (meal: any, amountMeal: number) => Promise<any>
    ): Promise<any | undefined> {
        const queryRunner = this.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');
        try {
            for (let i = 0; i < cancelOrder.orderDetails.length; i++) {
                const orderDetail = cancelOrder.orderDetails[i];
                const updateMeal = orderDetail.meal;
                const orderDetailAmount = orderDetail.amount;
                await fn(updateMeal, orderDetailAmount);
            }
            cancelOrder.status = OrderStatusEnum.CANCELED;
            await queryRunner.manager.update(Order, { id: cancelOrder.id }, { orderStatus: cancelOrder.status })
            await queryRunner.commitTransaction();
            return true
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            queryRunner.release();
        }
    }
    //use to rollback everything if the system create order failed
    async rollBackOrder(
        cancelOrder: any,
        fn: (meal: any, amountMeal: number) => Promise<any>
    ): Promise<any | undefined> {
        const queryRunner = this.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');
        try {
            for (let i = 0; i < cancelOrder.orderDetails.length; i++) {
                const orderDetail = cancelOrder.orderDetails[i];
                const updateMeal = orderDetail.meal;
                const orderDetailAmount = orderDetail.amount;
                await fn(updateMeal, orderDetailAmount);
            }
            // cancelOrder.status = OrderStatusEnum.ERROR;
            // await queryRunner.manager.update(Order, { id: cancelOrder.id }, { orderStatus: cancelOrder.status })
            await queryRunner.manager.delete(Order, { id: cancelOrder.id });
            await queryRunner.commitTransaction();
            return true
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            queryRunner.release();
        }
    }

    async getCountOrder(status: OrderStatusEnum): Promise<any | undefined> {
        try {
            const result = await this.createQueryBuilder('order')
                .where('order.orderStatus = :status', { status: status })
                .getCount()
            return result
        } catch (err) {
            return null;
        }
    }

    async getProfitByYear(year: number): Promise<any | undefined> {
        try {
            const query = `SELECT months.month, COALESCE(SUM(orders.totalPrice), 0) AS total
            FROM (
              SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
              SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION
              SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
            ) AS months
            LEFT JOIN (
              SELECT MONTH(orderDate) AS month, SUM(totalPrice) AS totalPrice
              FROM bird_meal.order
              WHERE YEAR(orderDate) = ${year} AND orderStatus = 'completed'
              GROUP BY MONTH(orderDate)
            ) AS orders ON months.month = orders.month
            GROUP BY months.month
            ORDER BY months.month`
            const result = await this.manager.query(query)
            return result
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}