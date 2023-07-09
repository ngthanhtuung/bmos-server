import { ProductMealService } from './../product_meal/product_meal.service';
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import Order from "./order.entity";
import { Repository } from "typeorm";
import { OrderCreateDto } from "./dto/order-create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import Meal from '../meal/meal.entity';
import Account from '../account/account.entity';


@CustomRepository(Order)
export class OrderRepository extends Repository<Order> {
    
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
            console.log("Order:", order);
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
                const orderDetail = await queryRunner.manager.save(
                    queryRunner.manager.create('OrderDetail', {
                        amount: amountMeal,
                        totalPrice: totalPrice,
                        order: order,
                        meal: meal,
                    })
                )
            }
            order.totalPrice = totalPriceOrder;
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
                const updateMeal = cancelOrder.orderDetails[i].meal;
                const orderDetailAmount = cancelOrder.orderDetails[i].amount;
                const result = await fn(updateMeal, orderDetailAmount);
            }
            cancelOrder.status = 'CANCELLED';
            await queryRunner.manager.save(cancelOrder);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            queryRunner.release();
        }
    }

}