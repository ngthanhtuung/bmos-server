import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MealModule } from '../meal/meal.module';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import { OrderRepository } from './order.repository';
import { CustomerModule } from '../customer/customer.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { TransactionModule } from '../transaction/transaction.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([OrderRepository]),
    forwardRef(() => PaymentModule),
    MealModule,
    CustomerModule,
    DeliveryModule,
    TransactionModule
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule { }
