import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { ProductModule } from '../product/product.module';
import { MealModule } from '../meal/meal.module';
import { StaffModule } from '../staff/staff.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MealModule,
    ProductModule,
    StaffModule,
    OrderModule
  ],
  controllers: [StoreController]
})
export class StoreModule { }
