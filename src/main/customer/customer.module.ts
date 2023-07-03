import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { SharedModule } from 'src/shared/shared.module';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import CustomerRepository from './customer.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([CustomerRepository]),
    SharedModule
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService]
})
export class CustomerModule { }
