import { MealService } from './../meal/meal.service';
import { Repository } from "typeorm";
import Account from "./account.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { RoleEnum } from "../role/role.enum";
import { AccountUpdateProfileDto } from "./dto/account-update.dto";
import { StatusEnum } from "src/shared/status.enum";
import { HttpException, HttpStatus } from "@nestjs/common";
import ApiResponse from "src/shared/res/apiReponse";

@CustomRepository(Account)
export default class AccountRepository extends Repository<Account> {


    async getAllUser(role: string): Promise<any | undefined> {
        try {
            if (role === RoleEnum.CUSTOMER) {
                const customers = await this.createQueryBuilder('account')
                    .leftJoinAndSelect('account.role', 'role')
                    .leftJoinAndSelect('account.customer', 'customer')
                    .select([
                        'account.id',
                        'account.fullName',
                        'account.dob',
                        'account.email',
                        'account.phoneNumber',
                        'account.avatar',
                        'account.status',
                        'account.refreshToken',
                        'customer.point'
                    ])
                    .where('role.name = :role', { role: role })
                    .getMany()
                return customers;
            } else {
                const staff = await this.createQueryBuilder('account')
                    .leftJoinAndSelect('account.role', 'role')
                    .leftJoinAndSelect('account.staff', 'staff')
                    .select([
                        'account.id',
                        'account.fullName',
                        'account.dob',
                        'account.email',
                        'account.phoneNumber',
                        'account.avatar',
                        'account.status',
                        'account.refreshToken',
                        'staff.identityNumber',
                        'staff.registerDate',
                        'staff.quitDate'
                    ])
                    .where('role.name = :role', { role: role })
                    .getMany()
                return staff;
            }
        } catch (err) {
            console.log('Error at getAllUser in AccountRepository: ', err.message)
            return null;
        }
    }

    async getProfile(account: Account): Promise<any | undefined> {
        if (account.role.name === RoleEnum.CUSTOMER) {
            const customer = await this.createQueryBuilder('account')
                .leftJoinAndSelect('account.customer', 'customer')
                .select([
                    'account.id',
                    'account.fullName',
                    'account.dob',
                    'account.email',
                    'account.phoneNumber',
                    'account.avatar',
                    'account.status',
                    'account.refreshToken',
                    'customer.point'

                ])
                .where('account.id = :id', { id: account.id })
                .getOne();
            return customer;
        } else {
            const staff = await this.createQueryBuilder('account')
                .leftJoinAndSelect('account.staff', 'staff')
                .select([
                    'account.id',
                    'account.fullName',
                    'account.dob',
                    'account.email',
                    'account.phoneNumber',
                    'account.avatar',
                    'account.status',
                    'account.refreshToken',
                    'staff.identityNumber',
                    'staff.registerDate',
                    'staff.quitDate'

                ])
                .where('account.id = :id', { id: account.id })
                .getOne();
            return staff;
        }
    }

    async updateProfile(userId: string, updateProfile: AccountUpdateProfileDto): Promise<any | undefined> {
        try {
            const updated = await this.createQueryBuilder()
                .update(Account)
                .set({
                    fullName: updateProfile.fullName,
                    dob: updateProfile.dob,
                    phoneNumber: updateProfile.phoneNumber,
                    avatar: updateProfile.avatar
                })
                .where('id = :id', { id: userId })
                .execute();
            if (updated.affected > 0) {
                const account = await this.findOne({
                    where: { id: userId }
                });

                console.log('Log user updated: ', account)
                const { password, ...rest } = account;
                return rest;
            }
        } catch (err) {
            return null;
        }
    }

    async updateStatus(userId: string, status: string): Promise<any | undefined> {
        try {
            const update = await this.createQueryBuilder()
                .update(Account)
                .set({
                    status: status
                })
                .where('id = :id', { id: userId })
                .execute();

            if (update.affected > 0) {
                return (status === StatusEnum.BAN ? `Ban user ${userId} successfully` : `Active user ${userId} successfully`);
            }
        } catch (err) {
            return false;
        }
    }

    async deleteUser(userId: string): Promise<any | undefined> {
        try {
            const deleted = await this.createQueryBuilder()
                .update(Account)
                .set({
                    status: StatusEnum.INACTIVE
                })
                .where('id = :id', { id: userId })
                .execute();

            if (deleted.affected > 0) {
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    async confirmEmail(userId: string): Promise<any | undefined> {
        try {
            const updated = await this.createQueryBuilder()
                .update(Account)
                .set({
                    status: StatusEnum.ACTIVE
                })
                .where('id = :id', { id: userId })
                .execute();
            if (updated.affected > 0) {
                return true;
            }
        } catch (err) {
            return null;
        }
    }

    async changePassword(userId: string, newPassword: string): Promise<any | undefined> {
        try {
            const result = await this.createQueryBuilder()
                .update(Account)
                .set({
                    password: newPassword
                })
                .where('id = :id', { id: userId })
                .execute();
            return (result.affected > 0) ? true : false;
        } catch (err) {
            return false;
        }
    }

    async getCountUserByStatus(status: StatusEnum): Promise<any | undefined> {
        try {
            const count = await this.createQueryBuilder('account')
                .where('account.status = :status', { status: status })
                .getCount();
            return count;
        } catch (err) {
            return null;
        }
    }

}