import { Controller, UseGuards, Get, Put, Param, Body, Delete, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse, ApiParam, ApiBadRequestResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { GetUser } from 'src/decorators/getUser.decorator';
import Account from './account.entity';
import ApiResponse from 'src/shared/res/apiReponse';
import { AccountService } from './account.service';
import { AccountUpdateProfileDto } from './dto/account-update.dto';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';
import { StatusEnum } from 'src/shared/status.enum';
import { ChangePasswordDto } from './dto/account-changePassword.dto';

@Controller('account')
@ApiTags('User')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AccountController {

    constructor(
        private readonly accountService: AccountService
    ) { }

    @Get('/profile')
    @ApiOkResponse({ description: 'Get profile successfully' })
    async getProfile(@GetUser() user: Account): Promise<ApiResponse<any> | undefined> {
        return await this.accountService.getUserProfile(user);
    }

    @Get('/list/:role')
    @hasRoles(RoleEnum.ADMIN)
    @ApiParam({
        name: 'role',
        enum: [RoleEnum.CUSTOMER, RoleEnum.STAFF],
    })
    async getAllUserByRole(@Param('role') role: RoleEnum): Promise<any | undefined> {
        return await this.accountService.getAllUser(role);
    }

    @Get('/detail/:userId')
    @hasRoles(RoleEnum.ADMIN)
    async getUserDetail(@Param('userId') userId: string): Promise<any | undefined> {
        return await this.accountService.getUserDetail(userId);
    }

    @Put('/profile')
    @ApiOkResponse({ description: 'Update profile successfully' })
    async updateProfile(@GetUser() user: Account, updateUser: AccountUpdateProfileDto): Promise<any | undefined> {
        return await this.accountService.updateUser(user.id, updateUser)
    }
    
    @Put('/:userId')
    @UseGuards(RolesGuard)
    @hasRoles(RoleEnum.ADMIN)
    @ApiOkResponse({ description: 'Get profile successfully' })
    async updateUser(
        @Param('userId') userId: string,
        @Body() updateProfile: AccountUpdateProfileDto
    ): Promise<ApiResponse<any> | undefined> {
        return await this.accountService.updateUser(userId, updateProfile);
    }

    @Put('/:userId/:status')
    @ApiParam({
        name: 'status',
        enum: [StatusEnum.ACTIVE, StatusEnum.BAN],
    })
    @UseGuards(RolesGuard)
    @hasRoles(RoleEnum.ADMIN)
    @ApiOkResponse({ description: 'Ban or Active user successfully' })
    @ApiBadRequestResponse({ description: 'You cannot delete yourself' })
    async updateStatus(@GetUser() user: Account, @Param('status') status: StatusEnum, @Param('userId') userId: string): Promise<any | undefined> {
        return await this.accountService.updateStatus(user, userId, status);
    }

    @Delete('/:userId')
    @UseGuards(RolesGuard)
    @hasRoles(RoleEnum.ADMIN)
    @ApiOkResponse({ description: 'Delete user successfully' })
    @ApiBadRequestResponse({ description: 'User not found or banned' })
    async deleteUser(@GetUser() loginUser: Account, @Param('userId') userId: string): Promise<ApiResponse<any> | undefined> {
        return await this.accountService.deleteUser(loginUser, userId);
    }

    @Post('/change-password')
    @ApiOkResponse({ description: 'Change password successfully' })
    async changePassword(@GetUser() loginUser: Account, @Body() password: ChangePasswordDto): Promise<any | undefined> {
        return await this.accountService.changePassword(loginUser, password);
    }


}
