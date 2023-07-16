import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import StaffRepository from './staff.repository';
import StaffCreateDto from './dto/staff-create.dto';
import { SharedService } from 'src/shared/shared.service';
import ApiResponse from 'src/shared/res/apiReponse';
import * as moment from 'moment';
import 'moment-timezone';
import { StatusEnum } from 'src/shared/status.enum';

@Injectable()
export class StaffService {

    constructor(
        private readonly sharedService: SharedService,
        private readonly staffRepository: StaffRepository,
    ) { }

    async getAllStaff(): Promise<any | undefined> {
        return await this.staffRepository.getAllStaff();
    }

    async getCountStaffInStore(): Promise<any | undefined> {
        return await this.staffRepository.getCountStaff()
    }

    async registerStaff(data: StaffCreateDto): Promise<any | undefined> {
        data.password = await this.sharedService.hashPassword(data.password);
        data.dob = await this.sharedService.stringToDate(data.dob.toString(), 'yyyy-mm-dd', '-')
        return await this.staffRepository.registerStaff(data);
    }

    async disableStaff(staffId: string): Promise<any | undefined> {
        try {
            const result = await this.staffRepository.disableStaff(staffId);
            if (result) {
                return new ApiResponse('Success', 'Disabled staff successfully')
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
