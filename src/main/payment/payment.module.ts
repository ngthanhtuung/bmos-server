import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from '../order/order.module';
import { TransactionModule } from '../transaction/transaction.module';
import { SharedModule } from 'src/shared/shared.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    forwardRef(() => OrderModule),
    TransactionModule,
    SharedModule,
    HttpModule
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService]
})
export class PaymentModule { }
