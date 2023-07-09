import { AutoMap } from "@automapper/classes";
import { OrderStatusEnum } from "./order-status.enum";
import CustomerDTO from "../customer/customer.dto";
import BaseDTO from "../base/base.dto";


export class OrderDTO extends BaseDTO {

    @AutoMap()
    public orderDate: Date;

    @AutoMap()
    public orderCode: string;

    @AutoMap()
    public totalPrice: number;

    @AutoMap()
    public shippingAddress: string;

    @AutoMap()
    public shippingWardCode: string;

    @AutoMap()
    public shippingDistrictCode: number;

    @AutoMap()
    public orderStatus: OrderStatusEnum;

    @AutoMap()
    public orderUrl: string;

    @AutoMap({ typeFn: () => CustomerDTO })
    public customer: CustomerDTO;
    
}