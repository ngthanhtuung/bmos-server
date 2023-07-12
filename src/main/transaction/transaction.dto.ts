import { AutoMap } from "@automapper/classes";
import BaseDTO from "../base/base.dto";
import { OrderDTO } from "../order/order.dto";

export class TransactionDTO extends BaseDTO {

    @AutoMap()
    paymentTime: string;

    @AutoMap()
    paymentType: string;

    @AutoMap()
    public momoTransactionId: string;

    @AutoMap({ typeFn: () => OrderDTO })
    public order: OrderDTO
}