import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductCategoryCreateDto } from './dto/category-create.dto';
import Category from './category.entity';
import { ProductCategoryRepository } from './product_category.repository';
import ApiResponse from 'src/shared/res/apiReponse';


@Injectable()
export class ProductCategoryService {

    constructor(
        private readonly productCategoryRepository: ProductCategoryRepository,
    ) { }

    async getProductCategory(): Promise<any | undefined> {
        try {
            const result = await this.productCategoryRepository.find({});
            if (result) {
                return new ApiResponse('Success', 'Get product category successfully', result);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createCategory(data: ProductCategoryCreateDto): Promise<any | undefined> {
        try {
            const category = new Category();
            category.name = data.category_name;
            const result = await this.productCategoryRepository.save(category);
            if (result) {
                return new ApiResponse('Success', 'Create category successfully', result);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
