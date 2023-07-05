import { Repository } from "typeorm";
import Product from "./product.entity";
import { CustomRepository } from "src/type-orm/typeorm-ex.decorator";
import { ProductCreateDto } from "./dto/product-create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import ApiResponse from "src/shared/res/apiReponse";
import { ProductUpdateDto } from "./dto/product-update.dto";

@CustomRepository(Product)
export class ProductRepository extends Repository<Product> {


    async createProduct(data: ProductCreateDto): Promise<any | undefined> {
        const queryRunner = this.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');
        try {
            const category = await queryRunner.manager.findOne('Category', {
                where: { id: data.categoryId }
            })

            const product = await queryRunner.manager.save(
                queryRunner.manager.create('Product', {
                    productName: data.productName,
                    price: data.price,
                    description: data.description,
                    expiredDate: data.expiredDate,
                    remainQuantity: data.remainQuantity,
                    image: data.image,
                    category: category
                })
            )
            if (product) {
                await queryRunner.commitTransaction();
                return new ApiResponse('Success', 'Create product successfully', product);
            }
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            queryRunner.release();
        }

    }

    async getProductByCategory(categoryId: string): Promise<any | undefined> {
        try {
            const products = await this.createQueryBuilder('product')
                .leftJoin('product.category', 'category')
                .where('category.id = :categoryId', { categoryId: categoryId })
                .getMany();
            if (products) {
                return new ApiResponse('Success', 'Get product by category successfully', products);
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProduct(productId: string, data: ProductUpdateDto): Promise<any | undefined> {
        try {
            const updated = await this.createQueryBuilder()
                .update(Product)
                .set({
                    productName: data.productName,
                    price: data.price,
                    description: data.description,
                    expiredDate: data.expiredDate,
                    remainQuantity: data.remainQuantity,
                    image: data.image,
                    status: data.status
                })
                .where('id = :productId', { productId: productId })
                .execute();
            if (updated.affected > 0) {
                return new ApiResponse('Success', 'Update product successfully');
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStatus(productId: string, status: boolean): Promise<any | undefined> {
        try {
            const updatedStatus = await this.createQueryBuilder()
                .update(Product)
                .set({
                    status: status
                })
                .where('id = :productId', { productId: productId })
                .execute();
            if (updatedStatus.affected > 0) {
                return new ApiResponse('Success', `${status === true ? 'Enable' : 'Disable'} product successfully`);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}