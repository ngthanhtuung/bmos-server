import { OrderService } from './order.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MealCheckDto } from '../meal/dto/meal-check.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';

@Controller('order')
@ApiTags("Order")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
    ) { }

    // @Post('/')
    // @hasRoles(RoleEnum.CUSTOMER)
    // @ApiBody({
    //     type: [MealCheckDto]
    // })
    // async createOrder(@Body() data: MealCheckDto[]): Promise<any | undefined> {
    //     return await this.orderService.createOrder(data);
    // }
}
