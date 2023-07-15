import { OrderService } from './order.service';
import { Body, Controller, Post, UseGuards, Get, Put, Param, Redirect, Query, Delete } from '@nestjs/common';
import { MealCheckDto } from '../meal/dto/meal-check.dto';
import { ApiBearerAuth, ApiBody, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';
import { GetUser } from 'src/decorators/getUser.decorator';
import Account from '../account/account.entity';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderStatusEnum } from './order-status.enum';

@Controller('order')
@ApiTags("Order")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
    ) { }


    @Get('/store')
    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    @ApiQuery({
        name: 'status',
        enum: [OrderStatusEnum.CREATED, OrderStatusEnum.CONFIRMED, OrderStatusEnum.DELIVERING, OrderStatusEnum.COMPLETED, OrderStatusEnum.CANCELED],
        required: false
    })
    async getAllOrders(@Query('status') status: OrderStatusEnum): Promise<any | undefined> {
        return await this.orderService.getAllOrders(status);
    }

    @Get('/customer')
    @hasRoles(RoleEnum.CUSTOMER)
    @ApiQuery({
        name: 'status',
        enum: [OrderStatusEnum.CREATED, OrderStatusEnum.CONFIRMED, OrderStatusEnum.DELIVERING, OrderStatusEnum.COMPLETED, OrderStatusEnum.CANCELED],
        required: false
    })
    async getAllOrderByCustomer(@GetUser() user: Account, @Query('status') status: OrderStatusEnum): Promise<any | undefined> {
        return await this.orderService.getAllOrderByCustomer(user, status);
    }

    @Get('/:orderId')
    async getOrderDetail(@Param('orderId') orderId: string): Promise<any | undefined> {
        return await this.orderService.getOrderDetail(orderId);
    }

    @Post('/')
    @hasRoles(RoleEnum.CUSTOMER)
    @ApiBody({
        type: OrderCreateDto
    })
    async createOrder(@Body() data: OrderCreateDto, @GetUser() user: Account): Promise<any | undefined> {
        return await this.orderService.createOrder(data, user);
    }

    @Put('/update-delivery/:orderId')
    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    async updateDeliveryStatus(@Param('orderId') orderId: string): Promise<any | undefined> {
        return await this.orderService.updateDelivery(orderId);
    }

    @Put('/update-complete/:orderId')
    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    async updateCompleteStatus(@Param('orderId') orderId: string): Promise<any | undefined> {
        return await this.orderService.updateComplete(orderId);
    }

    @Delete('/cancel/:orderId')
    @hasRoles(RoleEnum.CUSTOMER)
    async cancelOrder(@Param('orderId') orderId: string, @GetUser() user: Account): Promise<any | undefined> {
        return await this.orderService.cancelOrder(orderId, user);
    }


}
