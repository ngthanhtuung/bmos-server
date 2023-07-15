import { OrderService } from './order.service';
import { Body, Controller, Post, UseGuards, Get, Put, Param, Redirect } from '@nestjs/common';
import { MealCheckDto } from '../meal/dto/meal-check.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';
import { GetUser } from 'src/decorators/getUser.decorator';
import Account from '../account/account.entity';
import { OrderCreateDto } from './dto/order-create.dto';

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
    async getAllOrders(@GetUser() user: Account): Promise<any | undefined> {
        return await this.orderService.getAllOrders();
    }

    @Get('/customer')
    @hasRoles(RoleEnum.CUSTOMER)
    async getAllOrderByCustomer(@GetUser() user: Account): Promise<any | undefined> {
        return await this.orderService.getAllOrderByCustomer(user);
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

    @Put('/cancel/:orderId')
    async cancelOrder(@Param('orderId') orderId: string): Promise<any | undefined> {
        return await this.orderService.cancelOrder(orderId);
    }


}
