import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import AccountRepository from './account.repository';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([AccountRepository]),
    SharedModule
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule { }
