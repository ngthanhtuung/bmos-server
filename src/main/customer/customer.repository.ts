import { IsPhoneNumber } from 'class-validator';
import { Repository } from "typeorm";
import Customer from "./customer.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { CustomerCreateDto } from "./dto/customer-create.dto";
import { RoleEnum } from "../role/role.enum";
import Account from "../account/account.entity";
import { HttpException, HttpStatus } from "@nestjs/common";
import ApiResponse from 'src/shared/res/apiReponse';

@CustomRepository(Customer)
export default class CustomerRepository extends Repository<Customer> {
    
    async signUp(
        data: CustomerCreateDto,
        fn: (customer: Customer) => Promise<boolean>
    ): Promise<any | undefined> {
        const queryRunner = this.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');
        try {
            const role = await queryRunner.manager.findOne('Role', {
                where: { name: RoleEnum.CUSTOMER }
            })

            const account = await queryRunner.manager.save(
                queryRunner.manager.create('Account', {
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password,
                    dob: data.dob,
                    phoneNumber: data.phoneNumber,
                    refreshToken: '',
                    role: role,
                })
            );
            const customer = await queryRunner.manager.save(
                queryRunner.manager.create(Customer, { account: account })
            )

            const { password, ...rest } = account;
            const sendEmail = await fn(customer);
            if (sendEmail) {
                await queryRunner.commitTransaction();
                return new ApiResponse('Success', "Sign up successfully", rest);
            } else {
                await queryRunner.rollbackTransaction();
                throw new HttpException(new ApiResponse('Fail', 'Send email fail'), HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            queryRunner.release();
        }
    }



}