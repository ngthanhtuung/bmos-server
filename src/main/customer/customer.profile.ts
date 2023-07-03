import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import CustomerDTO from './customer.dto';
import Customer from './customer.entity';


@Injectable()
export class CustomerProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper.createMap(Customer, CustomerDTO);
        };
    }
}
