import { Controller, Delete, Param, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';

@Controller('staff')
@ApiTags('Staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StaffController {

    constructor(
        private staffService: StaffService
    ) { }

    @Get('/all')
    @hasRoles(RoleEnum.ADMIN)
    async getAllStaff(): Promise<any | undefined> {
        return await this.staffService.getAllStaff();
    }

    @Delete('/disable/:staffId')
    @hasRoles(RoleEnum.ADMIN)
    async disableStaff(@Param('staffId') staffId: string): Promise<boolean | undefined> {
        return await this.staffService.disableStaff(staffId)
    }
}
