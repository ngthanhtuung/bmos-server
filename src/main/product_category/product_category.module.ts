import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product_category.service';
import { ProductCategoryController } from './product_category.controller';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import { ProductCategoryRepository } from './product_category.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ProductCategoryRepository])
  ],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController]
})
export class ProductCategoryModule { }
