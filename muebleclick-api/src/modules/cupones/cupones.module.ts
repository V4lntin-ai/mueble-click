import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cupon } from './entities/cupones.entity';
import { CuponesService } from './cupones.service';
import { CuponesResolver } from './cupones.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Cupon])],
  providers: [CuponesService, CuponesResolver],
  exports: [CuponesService],
})
export class CuponesModule {}