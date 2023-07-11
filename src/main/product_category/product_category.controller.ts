import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductCategoryCreateDto } from './dto/category-create.dto';
import { ProductCategoryService } from './product_category.service';
import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { RolesGuard } from '../auth/role/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';

@Controller('category')
// @ApiTags('Product Category')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ProductCategoryController {


    constructor(
        private readonly productCategoryService: ProductCategoryService,
    ) { }

    // @Get()
    // async getProductCategory(): Promise<any | undefined> {
    //     return await this.productCategoryService.getProductCategory();
    // }

    // @Post('/')
    // @hasRoles(RoleEnum.ADMIN)
    // async createCategory(@Body() data: ProductCategoryCreateDto): Promise<any | undefined> {
    //     return this.productCategoryService.createCategory(data);
    // }
}
