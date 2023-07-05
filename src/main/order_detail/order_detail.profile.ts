import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import OrderDetail from './order_detail.entity';
import { OrderDetailDTO } from './order_detail.dto';


@Injectable()
export class OrderDetailProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper.createMap(OrderDetail, OrderDetailDTO);
        };
    }
}
