import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BirdCreateDto } from './dto/bird-create.dto';
import { BirdService } from './bird.service';

@Controller('bird')
@ApiTags('Bird')
export class BirdController {

    constructor(
        private readonly birdService: BirdService
    ) { }


    @Get('/')
    async getAllBird(): Promise<any | undefined> {
        return this.birdService.getAllBird();
    }

    @Post('/create')
    async createBird(@Body() data: BirdCreateDto): Promise<any | undefined> {
        return await this.birdService.createBird(data);
    }


}
