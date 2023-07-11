import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AutoMapperModule } from './auto-mapper/auto-mapper.module';
import { SharedModule } from './shared/shared.module';
import * as Joi from '@hapi/joi';
import { RoleModule } from './main/role/role.module';
import { AccountModule } from './main/account/account.module';
import { CustomerModule } from './main/customer/customer.module';
import { AuthModule } from './main/auth/auth.module';
import { StaffModule } from './main/staff/staff.module';
import { MailModule } from './main/mail/mail.module';
import { ProductModule } from './main/product/product.module';
import { ProductCategoryModule } from './main/product_category/product_category.module';
import { OrderModule } from './main/order/order.module';
import { OrderDetailModule } from './main/order_detail/order_detail.module';
import { MealModule } from './main/meal/meal.module';
import { ProductMealModule } from './main/product_meal/product_meal.module';
import { BirdModule } from './main/bird/bird.module';
import { DeliveryModule } from './main/delivery/delivery.module';
import { PaymentModule } from './main/payment/payment.module';
import { TransactionModule } from './main/transaction/transaction.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        MYSQL_PORT: Joi.number().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    AutoMapperModule,
    SharedModule,
    AuthModule,
    AccountModule,
    CustomerModule,
    RoleModule,
    StaffModule,
    MealModule,
    ProductModule,
    OrderModule,
    PaymentModule,
    MailModule,
    TransactionModule,
    ProductCategoryModule,
    OrderDetailModule,
    ProductMealModule,
    BirdModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
