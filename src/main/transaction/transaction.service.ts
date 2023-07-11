import { Injectable } from '@nestjs/common';
import Order from '../order/order.entity';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {

    constructor(
        private readonly transactionRepository: TransactionRepository,
    ) { }

    async createTransaction(order: Order, paymentType: string): Promise<any | undefined> {
        try {
            const transaction = await this.transactionRepository.createTransaction(order, paymentType);
            if (transaction) {
                return true;
            }
            return false;
        } catch (err) {
            console.log(err.message);
            return false;
        }
    }
}
