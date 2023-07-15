import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductCategoryCreateDto } from './dto/category-create.dto';
import Category from './category.entity';
import { ProductCategoryRepository } from './product_category.repository';
import ApiResponse from 'src/shared/res/apiReponse';
import Account from '../account/account.entity';
import { RoleEnum } from '../role/role.enum';
import { ProductCategoryUpdateDto } from './dto/category-update.dto';


@Injectable()
export class ProductCategoryService {

    constructor(
        private readonly productCategoryRepository: ProductCategoryRepository,
    ) { }

    async getProductCategory(user: Account): Promise<any | undefined> {
        const roleName = user.role.name;
        try {
            let result;
            if (roleName === RoleEnum.CUSTOMER) {
                result = await this.productCategoryRepository.find({
                    where: { status: true }
                })
            } else {
                result = await this.productCategoryRepository.find({});
            }
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
            category.name = data.categoryName;
            const result = await this.productCategoryRepository.save(category);
            if (result) {
                return new ApiResponse('Success', 'Create category successfully', result);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateCategory(categoryId: number, data: ProductCategoryUpdateDto): Promise<any | undefined> {
        try {
            const category = await this.productCategoryRepository.findOne({ where: { id: categoryId } });
            if (category) {
                category.name = data.categoryName;
                category.status = data.status;
                const result = await this.productCategoryRepository.save(category);
                if (result) {
                    return new ApiResponse('Success', 'Update category successfully', result);
                }
                throw new HttpException(new ApiResponse('Fail', 'Update category fail'), HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(new ApiResponse('Fail', 'Category not found'), HttpStatus.NOT_FOUND)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateStatusCategory(categoryId: number, status: string): Promise<any | undefined> {
        const newStatus = status === 'true' ? true : false
        try {
            const category = await this.productCategoryRepository.findOne({ where: { id: categoryId } });
            if (category) {
                category.status = newStatus;
                let message = (newStatus === true) ? 'Active' : 'Deactive';
                const result = await this.productCategoryRepository.save(category);
                if (result) {
                    return new ApiResponse('Success', `${message} category successfully`, result);
                }
                throw new HttpException(new ApiResponse('Fail', 'Update status category fail'), HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(new ApiResponse('Fail', 'Category not found'), HttpStatus.NOT_FOUND)
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
