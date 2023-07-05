import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import Order from "./order.entity";
import { Repository } from "typeorm";


@CustomRepository(Order)
export class OrderRepository extends Repository<Order> {

    
}