import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { Repository } from "typeorm";
import Order from "../order/order.entity";
import Transaction from "./transaction.entity";


@CustomRepository(Transaction)
export class TransactionRepository extends Repository<Transaction>{

    async createTransaction(order: Order, paymentType: string): Promise<any | undefined> {
        try {
            const transaction = new Transaction();
            transaction.paymentType = paymentType;
            transaction.order = order;
            const result = await this.save(transaction)
            return result;
        } catch (err) {
            console.log(err)
            return undefined;
        }
    }
}