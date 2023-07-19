import { Controller, Query, Post, Get, HttpException, Res, Redirect, Param, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';

@Controller('payment')
@ApiTags('Payment')

export class PaymentController {


    constructor(
        private readonly paymentService: PaymentService,
    ) { }

    @Get('/confirm')
    async confirmPayment(
        @Query('partnerCode') partnerCode: string,
        @Query('orderId') orderId: string,
        @Query('requestId') requestId: string,
        @Query('transId') transId: number,
        @Query('amount') amount: string,
        @Query('orderInfo') orderInfo: string,
        @Query('orderType') orderType: string,
        @Query('resultCode') resultCode: number,
        @Query('message') message: string,
        @Query('payType') payType: string,
        @Query('responseTime') responseTime: string,
        @Query('extraData') extraData: string,
        @Query('signature') signature: string
    ): Promise<any | undefined> {
        const confirmOrderId = orderInfo.split('#')[1];
        return await this.paymentService.confirmPayment(confirmOrderId, resultCode, transId);
    }


    @Post('/re-payment/:orderId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(RoleEnum.CUSTOMER)
    async rePayment(@Param('orderId') orderId: string): Promise<any | undefined> {
        return await this.paymentService.rePayment(orderId)
    }


}
