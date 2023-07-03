import { Injectable } from '@nestjs/common';
import StaffRepository from './staff.repository';
import StaffCreateDto from './dto/staff-create.dto';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class StaffService {

    constructor(
        private readonly sharedService: SharedService,
        private readonly staffRepository: StaffRepository,
    ) { }

    async registerStaff(data: StaffCreateDto): Promise<any | undefined> {
        data.password = await this.sharedService.hashPassword(data.password);
        data.dob = await this.sharedService.stringToDate(data.dob.toString(), 'yyyy-mm-dd', '-')
        return await this.staffRepository.registerStaff(data);
    }
}
