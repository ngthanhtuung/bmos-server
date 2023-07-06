import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MealModule } from '../meal/meal.module';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import { OrderRepository } from './order.repository';
import { MealRepository } from '../meal/meal.repository';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([OrderRepository]),
    MealModule,
    CustomerModule
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule { }
