import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { BirdCreateDto } from './dto/bird-create.dto';
import { BirdService } from './bird.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';
import { BirdUpdateDto } from './dto/bird-update.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import Account from '../account/account.entity';

@Controller('bird')
@ApiTags('Bird')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class BirdController {

    constructor(
        private readonly birdService: BirdService
    ) { }

    @Get('/')
    async getAllBird(@GetUser() user: Account): Promise<any | undefined> {
        return this.birdService.getAllBird(user);
    }

    @Post('/create')
    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    async createBird(@Body() data: BirdCreateDto): Promise<any | undefined> {
        return await this.birdService.createBird(data);
    }
    @Get('/:birdId')
    async getBirdDetail(@Param('birdId') birdId: string): Promise<any | undefined> {
        return this.birdService.getBirdDetail(birdId);
    }
    @Put('/:birdId')
    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    async updateBird(@Param('birdId') birdId: string, @Body() data: BirdUpdateDto): Promise<any | undefined> {
        return this.birdService.updateBird(birdId, data);
    }

    @Put('/:birdId/status/:status')
    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    @ApiParam({
        name: 'status',
        enum: ['true', 'false']
    })
    async updateBirdStatus(@Param('birdId') birdId: string, @Param('status') status: any): Promise<any | undefined> {
        return this.birdService.updateBirdStatus(birdId, status);
    }
}
