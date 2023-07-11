import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from '../order/order.module';
import { TransactionModule } from '../transaction/transaction.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    forwardRef(() => OrderModule),
    TransactionModule,
    SharedModule
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService]
})
export class PaymentModule { }
