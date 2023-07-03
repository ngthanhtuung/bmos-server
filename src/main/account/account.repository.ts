import { Repository } from "typeorm";
import Account from "./account.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { RoleEnum } from "../role/role.enum";
import { AccountUpdateProfileDto } from "./dto/account-update.dto";
import { StatusEnum } from "src/shared/status.enum";

@CustomRepository(Account)
export default class AccountRepository extends Repository<Account> {


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
                    phoneNumber: updateProfile.phoneNumber
                })
                .where('id = :id', { id: userId })
                .execute();
            if (updated.affected > 0) {
                const account = await this.findOne({
                    where: { id: userId }
                });
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


}