import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductCategoryCreateDto } from './dto/category-create.dto';
import { ProductCategoryService } from './product_category.service';
import { Body, Controller, Post, UseGuards, Get, Put, Param } from '@nestjs/common';
import { RolesGuard } from '../auth/role/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';
import { GetUser } from 'src/decorators/getUser.decorator';
import Account from '../account/account.entity';
import { ProductCategoryUpdateDto } from './dto/category-update.dto';

@Controller('category')
@ApiTags('Product Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductCategoryController {

    constructor(
        private readonly productCategoryService: ProductCategoryService,
    ) { }

    @Get()
    async getProductCategory(@GetUser() user: Account): Promise<any | undefined> {
        return await this.productCategoryService.getProductCategory(user)
    }

    @Post('/')
    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    async createCategory(@Body() data: ProductCategoryCreateDto): Promise<any | undefined> {
        return this.productCategoryService.createCategory(data);
    }

    @Put('/:categoryId')
    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    async updateCategory(@Param('categoryId') categoryId: number, @Body() data: ProductCategoryUpdateDto): Promise<any | undefined> {
        return await this.productCategoryService.updateCategory(categoryId, data);
    }

    @Put('/:categoryId/status/:status')
    @ApiParam({
        name: 'status',
        enum: ['true', 'false']
    })
    @hasRoles(RoleEnum.STAFF, RoleEnum.ADMIN)
    async updateStatusCategory(@Param('categoryId') categoryId: number, @Param('status') status: string): Promise<any | undefined> {
        return await this.productCategoryService.updateStatusCategory(categoryId, status);
    }
}
