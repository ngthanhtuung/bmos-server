import { AutoMap } from "@automapper/classes";
import BaseDTO from "../base/base.dto";
import { OrderDTO } from "../order/order.dto";


export class OrderDetailDTO extends BaseDTO {

    @AutoMap()
    public amount: number;

    @AutoMap({ typeFn: () => OrderDTO })
    public order: OrderDTO;
}