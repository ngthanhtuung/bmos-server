import { Injectable } from '@nestjs/common';
import Order from '../order/order.entity';
import { TransactionRepository } from './transaction.repository';
import Transaction from './transaction.entity';

@Injectable()
export class TransactionService {

    constructor(
        private readonly transactionRepository: TransactionRepository,
    ) { }


    async getTransactionByOrder(order: Order): Promise<Transaction | undefined> {
        try {
            const result = await this.transactionRepository.getTransactionByOrder(order);
            if (result) {
                return result;
            }
            return undefined;
        } catch (err) {
            return undefined;
        }
    }

    async createTransaction(order: Order, paymentType: string, momoTransId?: number): Promise<any | undefined> {
        try {
            let transaction;

            if (paymentType === 'MOMO' && !momoTransId) {
                transaction = await this.transactionRepository.createTransaction(order, paymentType, momoTransId);
            } else {
                transaction = await this.transactionRepository.createTransaction(order, paymentType);
            }

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
