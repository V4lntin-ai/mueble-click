import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  providers: [RolesService, RolesResolver],
  exports: [RolesService],   // exportado para que auth y usuarios lo usen
})
export class RolesModule {}