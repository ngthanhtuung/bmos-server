import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import StaffRepository from './staff.repository';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmExModule.forCustomRepository([StaffRepository]),
  ],
  providers: [StaffService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule { }
