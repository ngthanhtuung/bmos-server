import { Module } from '@nestjs/common';
import { ProductMealService } from './product_meal.service';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import ProductMealRepository from './product_meal.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ProductMealRepository])],
  providers: [ProductMealService],
  exports: [ProductMealService],
})
export class ProductMealModule { }
