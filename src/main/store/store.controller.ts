import { MealService } from './../meal/meal.service';
import { ProductService } from './../product/product.service';
import { Controller, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';
import { OrderService } from '../order/order.service';
import { OrderStatusEnum } from '../order/order-status.enum';
import ApiResponse from 'src/shared/res/apiReponse';

@Controller('store')
@ApiTags('Store Dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StoreController {

    constructor(
        private readonly productService: ProductService,
        private readonly mealService: MealService,
        private readonly orderService: OrderService
    ) { }

    @Get('/staff-dashboard')
    @hasRoles(RoleEnum.STAFF)
    async staffDashBoard(): Promise<any | undefined> {
        try {
            const productQuantity = await this.productService.getCountProduct();
            const mealQuantity = await this.mealService.getCountMeal()
            const createdOrderQuantity = await this.orderService.getCountOrder(OrderStatusEnum.CREATED)
            const confirmOrderQuantity = await this.orderService.getCountOrder(OrderStatusEnum.CONFIRMED)
            const orderCompleted = await this.orderService.getCountOrder(OrderStatusEnum.COMPLETED)
            const orderCancel = await this.orderService.getCountOrder(OrderStatusEnum.CANCELED)
            const newOrder = createdOrderQuantity + confirmOrderQuantity
            const response = {
                'TotalProduct': productQuantity,
                'TotalMeal': mealQuantity,
                'NewOrder': newOrder,
                'OrderCompleted': orderCompleted,
                'OrderCancel': orderCancel
            }
            return new ApiResponse('Success', 'Data dashboard', response);
        } catch (err) {
            throw new HttpException(new ApiResponse('Error', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get('/admin-dashboard')
    @hasRoles(RoleEnum.ADMIN)
    async adminDashboard(): Promise<any | undefined> {

    }

}
