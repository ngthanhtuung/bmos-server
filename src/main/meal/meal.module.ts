import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { MealRepository } from './meal.repository';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import { ProductMealModule } from '../product_meal/product_meal.module';
import { BirdModule } from '../bird/bird.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MealRepository]),
    ProductMealModule,
    BirdModule,
    ProductModule
  ],
  providers: [MealService],
  controllers: [MealController],
  exports: [MealService]
})
export class MealModule { }
