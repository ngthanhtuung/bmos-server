import { Module } from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { OrderDetailController } from './order_detail.controller';

@Module({
  providers: [OrderDetailService],
  controllers: [OrderDetailController]
})
export class OrderDetailModule {}
