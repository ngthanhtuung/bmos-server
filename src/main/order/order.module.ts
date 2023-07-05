import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MealModule } from '../meal/meal.module';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([OrderRepository]),
    MealModule
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule { }
