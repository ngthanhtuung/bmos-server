import { Repository } from "typeorm";
import Staff from "./staff.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { HttpException, HttpStatus } from "@nestjs/common";
import ApiResponse from "src/shared/res/apiReponse";
import { RoleEnum } from "../role/role.enum";
import StaffCreateDto from "./dto/staff-create.dto";
import { StatusEnum } from "src/shared/status.enum";

@CustomRepository(Staff)
export default class StaffRepository extends Repository<Staff> {

    async getAllStaff(): Promise<any | undefined> {
        try {
            const staffs = await this.createQueryBuilder('staff')
                .leftJoinAndSelect('staff.account', 'account')
                .select([
                    'account.id',
                    'account.fullName',
                    'account.dob',
                    'account.email',
                    'account.phoneNumber',
                    'account.avatar',
                    'account.status',
                    'staff.identityNumber',
                    'staff.registerDate',
                    'staff.quitDate'
                ])
                .getMany()
            return new ApiResponse('Success', 'Get all staff successfully', staffs)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getCountStaff(): Promise<any | undefined> {
        const result = await this.createQueryBuilder('staff').getCount();
        return result
    }

    async registerStaff(data: StaffCreateDto): Promise<any | undefined> {
        const queryRunner = this.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');
        try {
            const role = await queryRunner.manager.findOne('Role', {
                where: { name: RoleEnum.STAFF }
            })

            const account = await queryRunner.manager.save(
                queryRunner.manager.create('Account', {
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password,
                    dob: data.dob,
                    avatar: data.avatar,
                    phoneNumber: data.phoneNumber,
                    refreshToken: '',
                    role: role,
                    status: StatusEnum.ACTIVE
                })
            );
            let staff;
            if (account) {
                staff = await queryRunner.manager.save(
                    queryRunner.manager.create(Staff, {
                        identityNumber: data.identityNumber,
                        registerDate: new Date().toISOString().slice(0, 10),
                        account: account
                    })
                )
            } else {
                await queryRunner.rollbackTransaction();
                throw new HttpException(new ApiResponse('Fail', 'Register staff fail'), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const { account: { password, ...accountWithoutPassword }, ...rest } = staff;
            const responseData = {
                ...rest,
                account: {
                    ...accountWithoutPassword
                }
            };
            await queryRunner.commitTransaction();
            return new ApiResponse('Success', "Register staff successfully", responseData);

        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log('error transaction in business repository');
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            queryRunner.release();
        }
    }

    async disableStaff(staffId: string): Promise<any | undefined> {
        try {
            const staff = await this.createQueryBuilder('staff')
                .leftJoinAndSelect('staff.account', 'account')
                .where('account.id = :staffId', { staffId: staffId })
                .getOne();
            if (staff) {
                staff.quitDate = new Date();
                staff.account.status = StatusEnum.INACTIVE
                const result = await this.save(staff)
                const query = `UPDATE account set status = '${StatusEnum.INACTIVE}' WHERE id = '${staffId}'`
                await this.query(query);
                if (result.account.status === StatusEnum.INACTIVE && staff.quitDate !== null) {
                    return true;
                } else {
                    return false;
                }
            }
            throw new HttpException(new ApiResponse('Fail', 'Staff not found'), HttpStatus.NOT_FOUND);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}