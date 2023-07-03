import { hasRoles } from './role/roles.decorator';
import { Controller, Post, Get, Body, UseGuards, Request, UseInterceptors, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomerCreateDto } from '../customer/dto/customer-create.dto';
import { AuthService } from './auth.service';
import Account from '../account/account.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { LoginDto } from './dto/loginDto';
import { Public } from './public';
import { LocalAuthGuard } from './local-auth/local-auth.guard';
import { LoginGoogleDto } from './dto/loginByGoogleDto';
import ApiResponse from 'src/shared/res/apiReponse';
import StaffCreateDto from '../staff/dto/staff-create.dto';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { RolesGuard } from './role/roles.guard';
import { RoleEnum } from '../role/role.enum';
import { MapInterceptor } from '@automapper/nestjs';
import AccountDTO from '../account/account.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('/login')
    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({ description: 'Login successfully' })
    login(@GetUser() user: Account): any {
        return this.authService.login(user);
    }

    @Post('/login-google')
    @Public()
    @ApiOkResponse({ description: 'Login successfully' })
    async loginByGoogle(@Body() firebaseToken: LoginGoogleDto): Promise<ApiResponse<any> | undefined> {
        return await this.authService.loginByGoogle(firebaseToken.token);
    }


    @Post('/signup')
    @ApiBody({ type: CustomerCreateDto })
    @ApiOkResponse({ description: 'Sign up successfully' })
    async signUpCustomer(@Body() data: CustomerCreateDto): Promise<any | undefined> {
        return await this.authService.signUpCustomer(data);
    }

    @Post('/register-staff')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(RoleEnum.ADMIN)
    @ApiCreatedResponse({ description: 'Register staff successfully' })
    async registerStaff(@Body() data: StaffCreateDto): Promise<any | undefined> {
        return await this.authService.registerStaff(data);
    }

    @Get('/confirm-email/:userId')
    async confirmEmail(@Param('userId') userId: string): Promise<any | undefined> {
        return await this.authService.confirmEmail(userId);
    }
}
