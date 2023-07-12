import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { Repository } from "typeorm";
import Order from "../order/order.entity";
import Transaction from "./transaction.entity";


@CustomRepository(Transaction)
export class TransactionRepository extends Repository<Transaction>{

    async getTransactionByOrder(order: Order): Promise<Transaction | undefined> {
        try {
            const transaction = await this.createQueryBuilder('transaction')
                .leftJoin('transaction.order', 'order')
                .where('order.id = :orderId', { orderId: order.id })
                .getOne();
            if (transaction) {
                return transaction;
            }
            return undefined;
        } catch (err) {
            return undefined;
        }
    }

    async createTransaction(order: Order, paymentType: string, momoTransId?: number): Promise<any | undefined> {
        try {
            const transaction = new Transaction();
            transaction.paymentType = paymentType;
            transaction.order = order;
            if (paymentType === 'MOMO') {
                transaction.momoTransactionId = momoTransId;
            } else {
                transaction.momoTransactionId = 0;
            }
            const result = await this.save(transaction)
            return result;
        } catch (err) {
            console.log(err)
            return undefined;
        }
    }
}