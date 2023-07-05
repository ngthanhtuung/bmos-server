import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import { ProductRepository } from './product.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ProductRepository])
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule { }
