import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SharedService } from 'src/shared/shared.service';
import { CustomerCreateDto } from '../customer/dto/customer-create.dto';
import { CustomerService } from '../customer/customer.service';
import Account from '../account/account.entity';
import { AccountService } from '../account/account.service';
import ApiResponse from 'src/shared/res/apiReponse';
import { StatusEnum } from 'src/shared/status.enum';
import { Payload } from './jwt-auth/payload';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import * as firebaseAdmin from 'firebase-admin';
import { LoginGoogleDto } from './dto/loginByGoogleDto';
import { StaffService } from '../staff/staff.service';
import StaffCreateDto from '../staff/dto/staff-create.dto';
import { RoleEnum } from '../role/role.enum';

@Injectable()
export class AuthService {

    constructor(
        private readonly sharedService: SharedService,
        private readonly accountService: AccountService,
        private readonly customerService: CustomerService,
        private readonly staffService: StaffService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string, role: string): Promise<Account | undefined> {
        const user = await this.accountService.findUserByEmail(email);
        if (!user) {
            throw new HttpException(new ApiResponse('Failed', "User not found"), HttpStatus.NOT_FOUND);
        }
        const isMatch = await this.sharedService.comparePassword(password, user.password);
        if (user.status === StatusEnum.BAN) {
            throw new HttpException(new ApiResponse('Failed', "User is banned, please contact us for assisting!"), HttpStatus.BAD_REQUEST);
        } else if (user.status === StatusEnum.UNVERIFIED) {
            throw new HttpException(new ApiResponse('Failed', "User is not verified, please check your email to verify account"), HttpStatus.BAD_REQUEST);
        }
        if (user && isMatch && user.status === StatusEnum.ACTIVE) {
            user.password = undefined
            if (user.role.name === role) {
                return user;
            }
        }
        throw new HttpException(new ApiResponse('Failed', "Email or Password is invalid"), HttpStatus.BAD_REQUEST);
    }

    login(account: Account) {
        const payload: Payload = {
            id: account.id,
            email: account.email,
            roles: [account.role.name]

        }
        const accessToken = this.jwtService.sign(payload, {
            secret: jwtConstants.accessTokenSecret,
            expiresIn: '3d',
        });
        const refreshToken = this.jwtService.sign(
            { id: payload.id },
            {
                secret: jwtConstants.refreshTokenSecret,
                expiresIn: '60days',
            },
        );
        this.accountService.updateRefreshToken(account.email, refreshToken);
        return new ApiResponse('Success', 'Login Successfully', { accessToken: accessToken, refreshToken: refreshToken });
    }

    async loginByGoogle(token: string): Promise<ApiResponse<any> | undefined> {
        try {
            const userFirebase = await firebaseAdmin.auth().verifyIdToken(token);
            if (!userFirebase) {
                throw new HttpException(new ApiResponse('Failed', "Token invalid"), HttpStatus.BAD_REQUEST);
            }
            const user = await this.accountService.findUserByEmail(userFirebase.email);
            if (!user) {
                throw new HttpException(new ApiResponse('Failed', 'User not found'), HttpStatus.NOT_FOUND);
            }
            return this.login(user);
        } catch (err) {
            return new ApiResponse('Failed', err.message);
        }
    }

    async signUpCustomer(data: CustomerCreateDto): Promise<any | undefined> {
        return await this.customerService.signUpCustomer(data);
    }

    async registerStaff(data: StaffCreateDto): Promise<any | undefined> {
        return await this.staffService.registerStaff(data);
    }

    async confirmEmail(userId: string): Promise<any | undefined> {
        return await this.accountService.confirmEmail(userId);
    }

}
