import { OrderStatusEnum } from './../order/order-status.enum';
import { HttpException, HttpStatus, Inject, Injectable, Query, Res, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import Order from '../order/order.entity';
import ApiResponse from 'src/shared/res/apiReponse';
import { OrderService } from '../order/order.service';
import { TransactionService } from '../transaction/transaction.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class PaymentService {

    constructor(

        private readonly configService: ConfigService,
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService,
        private readonly transactionService: TransactionService,

    ) { }
    private readonly SERVER_HOST = this.configService.get<string>('SERVER_HOST');
    private readonly PORT = this.configService.get<string>('PORT');
    private readonly PATH_API = this.configService.get<string>('PATH_OPEN_API');
    private readonly partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE');
    private readonly accessKey = this.configService.get<string>('MOMO_ACCESS_KEY');
    private readonly secretKey = this.configService.get<string>('MOMO_SECRET_KEY')
    private readonly redirectUrl = `${this.SERVER_HOST}:${this.PORT}/${this.PATH_API}/payment/confirm`;
    private readonly ipnUrl = 'https://momo.vn/';


    async createPayment(order: Order): Promise<string> {
        const requestId = uuidv4();
        const orderId = uuidv4();
        const orderInfo = `Thanh Toán đơn hàng #${order.id}`;
        const requestType = 'captureWallet';
        const extraData = '';
        const amount = order.totalPrice;
        const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: this.partnerCode,
            accessKey: this.accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl: this.redirectUrl,
            ipnUrl: this.ipnUrl,
            extraData,
            requestType,
            signature,
            lang: 'en',
        };
        try {
            const response = await axios.post(
                'https://test-payment.momo.vn/v2/gateway/api/create',
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            const payUrl = response.data.payUrl;
            return payUrl;
        } catch (error) {
            console.error('MoMo createPayment error:', error.response?.data || error.message);
            return undefined;
        }
    }

    async confirmPayment(orderId: string, resultCode: number, momoTransId: number): Promise<any | undefined> {
        try {
            if (resultCode == 0) {
                const order = await this.orderService.getOrder(orderId);
                const transaction = await this.transactionService.createTransaction(order, 'MOMO', momoTransId);
                if (transaction) {
                    const updateOrder = await this.orderService.updateOrderStatus(order.id, OrderStatusEnum.CONFIRMED)
                    return new ApiResponse('Success', 'Payment successfully!')
                }
            }
            throw new HttpException(new ApiResponse('Fail', 'Payment failed!'), HttpStatus.BAD_REQUEST)
        } catch (err) {
            console.error('MoMo confirmPayment error:', err.response?.data || err.message);
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async rePayment(orderId: string): Promise<any | undefined> {
        try {
            const order = await this.orderService.getOrder(orderId);
            if (order && order.orderStatus === OrderStatusEnum.CREATED) {
                const payUrl = await this.createPayment(order);
                return new ApiResponse('Success', 'Re-Payment successfully!', payUrl);
            }
            throw new HttpException(new ApiResponse('Fail', 'Re-payment failed!'), HttpStatus.BAD_REQUEST)
        } catch (err) {
            console.error('MoMo rePayment error:', err.response?.data || err.message);
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
