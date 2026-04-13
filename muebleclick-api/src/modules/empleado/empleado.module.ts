import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { EmpleadoService } from './empleado.service';
import { EmpleadoResolver } from './empleado.resolver';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { SucursalesModule } from '../sucursales/sucursales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empleado]),
    UsuariosModule,
    SucursalesModule,
  ],
  providers: [EmpleadoService, EmpleadoResolver],
  exports: [EmpleadoService],
})
export class EmpleadoModule {}