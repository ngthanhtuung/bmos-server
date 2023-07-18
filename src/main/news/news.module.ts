import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import { NewsRepository } from './news.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([NewsRepository])],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService]
})
export class NewsModule { }
