import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { RoleEnum } from '../role/role.enum';
import { hasRoles } from '../auth/role/roles.decorator';
import { NewsCreateDto } from './dto/news-dto-create';
import { NewsUpdateDTO } from './dto/news-dto-update';
@Controller('news')
@ApiTags('News')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
export class NewsController {
    constructor(
        private readonly newService: NewsService
    ) { }

    @Get('/')
    async getAllNews(): Promise<any | undefined> {
        return this.newService.getAllNews();
    }
    @Get('/:idNews')
    async getNewsDetail(@Param('idNews') idNews: string): Promise<any | undefined> {
        return this.newService.getNewsDetail(idNews);
    }
    @hasRoles(RoleEnum.ADMIN)
    @Post("/create")
    async createNews(@Body() data: NewsCreateDto): Promise<any | undefined> {
        return await this.newService.createNews(data);
    }
    @Put("/update/:idNews/status/:status")
    async updateStatus(@Param('idNews') idNews: string, @Param('status') status: boolean): Promise<any | undefined> {
        return await this.newService.updateStatus(idNews, status);
    }
    @Put("/update/:idNews")
    async updateNews(@Param('idNews') idNews: string, @Body() data: NewsUpdateDTO): Promise<any | undefined> {
        return await this.newService.updateNews(idNews, data);
    }
}
