import { Controller, Query, Post, Get, HttpException, Res, Redirect } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';

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
        return await this.paymentService.confirmPayment(orderId, resultCode, transId);
    }


    // @Post()
    // async createPayment(@Query('amount') amount: string): Promise<string> {
    //     return this.paymentService.createPayment(amount);
    // }
}
