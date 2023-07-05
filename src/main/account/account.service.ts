import { HttpException, HttpStatus, Injectable, Param, Put, UseGuards } from '@nestjs/common';
import AccountRepository from './account.repository';
import Account from './account.entity';
import ApiResponse from 'src/shared/res/apiReponse';
import { RoleEnum } from '../role/role.enum';
import { AccountUpdateProfileDto } from './dto/account-update.dto';
import { StatusEnum } from 'src/shared/status.enum';
import { GetUser } from 'src/decorators/getUser.decorator';
import { ApiParam } from '@nestjs/swagger';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { log } from 'console';
import { ChangePasswordDto } from './dto/account-changePassword.dto';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class AccountService {

    constructor(
        private readonly sharedService: SharedService,
        private readonly accountRepository: AccountRepository,

    ) { }

    async findUserByEmail(email: string): Promise<Account | undefined> {
        try {
            const user = await this.accountRepository.findOne({
                where: { email: email },
                relations: ['role']
            })
            return user;
        } catch (err) {
            return null;
        }
    }

    async updateRefreshToken(email: string, refreshToken: string): Promise<boolean | undefined> {
        try {
            await this.accountRepository.update({ email: email }, { refreshToken: refreshToken });
            return true;
        } catch (err) {
            return false;
        }
    }

    async getUserProfile(user: Account): Promise<ApiResponse<any> | undefined> {
        try {
            if (user.role.name === RoleEnum.ADMIN) {
                return new ApiResponse('Success', 'Get profile successfully', user);
            }
            const account = await this.accountRepository.getProfile(user);
            return new ApiResponse('Success', 'Get profile successfully', account);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateUser(userId: string, updateProfile: AccountUpdateProfileDto): Promise<ApiResponse<any> | undefined> {
        try {
            const existed = await this.accountRepository.findOne({
                where: { id: userId },
            });
            if (!existed || existed.status === StatusEnum.BAN) {
                throw new HttpException(new ApiResponse('Fail', 'User not found or banned'), HttpStatus.NOT_FOUND)
            }
            const updatedUser = await this.accountRepository.updateProfile(userId, updateProfile);
            return new ApiResponse('Success', 'Update profile successfully', updatedUser);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateStatus(loginUser: Account, userId: string, updatedStatus: string): Promise<ApiResponse<any> | undefined> {
        try {
            if (loginUser.id === userId) {
                throw new HttpException(new ApiResponse('Fail', 'You cannot delete yourself'), HttpStatus.BAD_REQUEST)
            }
            const updatedMessage = await this.accountRepository.updateStatus(userId, updatedStatus);
            if (updatedMessage) {
                return new ApiResponse('Success', updatedMessage);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteUser(user: Account, userId: string): Promise<ApiResponse<any> | undefined> {
        try {
            if (user.id === userId) {
                throw new HttpException(new ApiResponse('Fail', 'You cannot delete yourself'), HttpStatus.BAD_REQUEST)
            }
            const deleted = await this.accountRepository.deleteUser(userId);
            if (deleted) {
                return new ApiResponse('Success', 'Delete user successfully');
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async confirmEmail(userId: string): Promise<any | undefined> {
        try {
            const statusUser = await this.accountRepository.findOne({
                where: {id: userId},
            })
            if (statusUser.status === StatusEnum.ACTIVE) {
                throw new HttpException(new ApiResponse('Fail', 'Your account is already active'), HttpStatus.BAD_REQUEST);
            }
            const result = await this.accountRepository.confirmEmail(userId);
            if (result) {
                return new ApiResponse('Success', 'Confirm email successfully');
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async changePassword(user: Account, password: ChangePasswordDto): Promise<ApiResponse<any> | undefined> {
        try {
            const isMatch = await this.sharedService.comparePassword(password.oldPassword, user.password);
            if (!isMatch) {
                throw new HttpException(new ApiResponse('Fail', 'Old password is not correct'), HttpStatus.BAD_REQUEST);
            }
            if (password.newPassword !== password.confirmNewPassword) {
                throw new HttpException(new ApiResponse('Fail', 'Confirm password is not correct'), HttpStatus.BAD_REQUEST);
            }
            const hashNewPassword = await this.sharedService.hashPassword(password.newPassword);
            const result = await this.accountRepository.changePassword(user.id, hashNewPassword);
            if (result) {
                return new ApiResponse('Success', 'Change password successfully');
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}


