import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import Staff from './staff.entity';
import StaffDTO from './staff.dto';

@Injectable()
export class StaffProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper.createMap(Staff, StaffDTO);
        };
    }
}
