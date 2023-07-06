import { ApiBearerAuth, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductService } from './product.service';
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { ProductUpdateDto } from './dto/product-update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role/roles.guard';
import { hasRoles } from '../auth/role/roles.decorator';
import { RoleEnum } from '../role/role.enum';

@Controller('product')
@ApiTags('Product')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductController {

    constructor(
        private readonly productService: ProductService
    ) { }

    @hasRoles(RoleEnum.CUSTOMER, RoleEnum.STAFF, RoleEnum.ADMIN)
    @Get('/:productId/available')
    async checkProductAvailable(@Param('productId') productId: string, @Query('quantity') quantity: number): Promise<any | undefined> {
        return await this.productService.checkAvailableProduct(productId, quantity);
    }

    @hasRoles(RoleEnum.ADMIN, RoleEnum.CUSTOMER, RoleEnum.STAFF)
    @Get("/:categoryId")
    async getProductByCategory(@Param('categoryId') categoryId: string): Promise<any | undefined> {
        return await this.productService.getProductByCategory(categoryId);
    }

    @hasRoles(RoleEnum.ADMIN, RoleEnum.CUSTOMER, RoleEnum.STAFF)
    @Get("/")
    async getProduct(): Promise<any | undefined> {
        return await this.productService.getAllProduct();
    }
    
    @hasRoles(RoleEnum.ADMIN)
    @Post("/")
    async createProduct(@Body() data: ProductCreateDto): Promise<any | undefined> {
        return await this.productService.createProduct(data);
    }

    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    @Put('/:productId')
    async updateProduct(@Param('productId') productId: string, @Body() data: ProductUpdateDto): Promise<any | undefined> {
        return await this.productService.updateProduct(productId, data);
    }

    @hasRoles(RoleEnum.ADMIN, RoleEnum.STAFF)
    @Put('/:productId/:status')
    @ApiParam({
        name: 'status',
        enum: ['ACTIVE', 'INACTIVE']
    })
    async updateStatus(@Param('productId') productId: string, @Param('status') status: string): Promise<any | undefined> {
        return await this.productService.updateStatusProduct(productId, status);
    }


}
