import { Module } from '@nestjs/common';
import { BirdService } from './bird.service';
import { BirdController } from './bird.controller';
import { TypeOrmExModule } from 'src/type-orm/typeorm-ex.module';
import { BirdRepository } from './bird.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BirdRepository])
  ],
  providers: [BirdService],
  controllers: [BirdController],
  exports: [BirdService],
})
export class BirdModule { }
