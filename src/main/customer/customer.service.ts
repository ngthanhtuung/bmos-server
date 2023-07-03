import { HttpException, Injectable } from '@nestjs/common';
import { CustomerCreateDto } from './dto/customer-create.dto';
import CustomerRepository from './customer.repository';
import ApiResponse from 'src/shared/res/apiReponse';
import { SharedService } from 'src/shared/shared.service';
import Customer from './customer.entity';
import Account from '../account/account.entity';

@Injectable()
export class CustomerService {

    constructor(
        private readonly customerRepository: CustomerRepository,
        private readonly sharedService: SharedService
    ) {

    }

    async signUpCustomer(data: CustomerCreateDto): Promise<any | undefined> {
        const password = data.password;
        const confirmPassword = data.confirmPassword;
        if (password !== confirmPassword) {
            throw new HttpException(new ApiResponse('Fail', "Password and confirm password don't match"), 400);
        }
        data.password = await this.sharedService.hashPassword(password);
        data.dob = await this.sharedService.stringToDate(data.dob.toString(), 'yyyy-mm-dd', '-');

        const callback = async (customer: Customer): Promise<boolean | undefined> => {
            const result = await this.sharedService.sendConfirmationEmail(customer);
            return result;
        }
        return await this.customerRepository.signUp(data, callback);
    }

    async getUserProfile(id: string): Promise<any | undefined> {

        console.log(this.customerRepository)
        const customer = await this.customerRepository.findOne({
            where: { }
        })
    }
}
