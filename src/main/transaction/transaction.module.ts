import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import { TransactionRepository } from './transaction.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TransactionRepository])
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule { }
