import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import AccountDTO from './account.dto';
import Account from './account.entity';


@Injectable()
export class AccountProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper): void => {
            mapper.createMap(Account, AccountDTO);
        };
    }
}
