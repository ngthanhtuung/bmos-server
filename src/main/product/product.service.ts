import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductCreateDto } from './dto/product-create.dto';
import ApiResponse from 'src/shared/res/apiReponse';
import { ProductUpdateDto } from './dto/product-update.dto';

@Injectable()
export class ProductService {

    constructor(
        private readonly productRepository: ProductRepository
    ) { }

    async createProduct(data: ProductCreateDto): Promise<any | undefined> {
        return await this.productRepository.createProduct(data);
    }

    async getProductByCategory(categoryId: string): Promise<any | undefined> {
        try {
            return await this.productRepository.getProductByCategory(categoryId);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllProduct(): Promise<any | undefined> {
        try {
            return await this.productRepository.getAllProduct();
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProduct(productId: string, data: ProductUpdateDto): Promise<any | undefined> {
        try {
            const product = await this.productRepository.findOne({ where: { id: productId } });
            if (!product) {
                throw new HttpException(new ApiResponse('Fail', 'Product not found'), HttpStatus.NOT_FOUND);
            }
            return await this.productRepository.updateProduct(productId, data);
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStatusProduct(productId: string, status: any): Promise<any | undefined> {
        try {
            const product = await this.productRepository.findOne({ where: { id: productId } });
            if (!product) {
                throw new HttpException(new ApiResponse('Fail', 'Product not found'), HttpStatus.NOT_FOUND);
            } else {
                let statusProduct = false;
                if (status === 'ACTIVE') {
                    statusProduct = true;
                }
                return await this.productRepository.updateStatus(productId, statusProduct);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async checkAvailableProduct(productId: string, quantity: number): Promise<any | undefined> {
        try {
            const product = await this.productRepository.findOne(
                { where: { id: productId, status: true } }
            );
            if (!product) {
                throw new HttpException(new ApiResponse('Fail', 'Product not found'), HttpStatus.NOT_FOUND);
            }
            if (product.remainQuantity >= quantity) {
                return new ApiResponse('Success', `Product ${product.productName} available`);
            } else {
                throw new HttpException(new ApiResponse('Fail', `Product ${product.productName} not available`), HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw new HttpException(new ApiResponse('Fail', err.message), err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateQuantityProduct(productId: string, quantity: number): Promise<any | undefined> {
        return await this.productRepository.updateQuantity(productId, quantity);
    }
}
