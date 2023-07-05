import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BirdCreateDto } from './dto/bird-create.dto';
import { BirdService } from './bird.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';

@Controller('bird')
@ApiTags('Bird')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class BirdController {

    constructor(
        private readonly birdService: BirdService
    ) { }


    @Get('/')
    async getAllBird(): Promise<any | undefined> {
        return this.birdService.getAllBird();
    }

    @Post('/create')
    @hasRoles(RoleEnum.ADMIN)
    async createBird(@Body() data: BirdCreateDto): Promise<any | undefined> {
        return await this.birdService.createBird(data);
    }
}
