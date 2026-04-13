import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './entities/empleado.entity';
import { CreateEmpleadoInput } from './dto/create-empleado.input';
import { UpdateEmpleadoInput } from './dto/update-empleado.input';
import { UsuariosService } from '../usuarios/usuarios.service';
import { SucursalesService } from '../sucursales/sucursales.service';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    private readonly usuariosService: UsuariosService,
    private readonly sucursalesService: SucursalesService,
  ) {}

  async findAll(): Promise<Empleado[]> {
    return this.empleadoRepository.find();
  }

  async findOne(id_usuario: number): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findOneBy({ id_usuario });
    if (!empleado)
      throw new NotFoundException(
        `Empleado con id_usuario #${id_usuario} no encontrado`,
      );
    return empleado;
  }

  async findBySucursal(id_sucursal: number): Promise<Empleado[]> {
    return this.empleadoRepository.find({
      where: { sucursal: { id_sucursal } },
    });
  }

  async findVendedores(id_sucursal: number): Promise<Empleado[]> {
    return this.empleadoRepository.find({
      where: {
        sucursal: { id_sucursal },
        es_vendedor: true,
        activo: true,
      },
    });
  }

  async create(input: CreateEmpleadoInput): Promise<Empleado> {
    const usuario = await this.usuariosService.findOne(input.id_usuario);

    const existe = await this.empleadoRepository.findOneBy({
      id_usuario: input.id_usuario,
    });
    if (existe)
      throw new ConflictException(
        `El usuario #${input.id_usuario} ya tiene perfil de empleado`,
      );

    const empleado = this.empleadoRepository.create({
      id_usuario: usuario.id_usuario,
      usuario,
      puesto: input.puesto,
      fecha_ingreso: input.fecha_ingreso,
      es_vendedor: input.es_vendedor ?? false,
      codigo_vendedor: input.codigo_vendedor,
      comision_pct: input.comision_pct,
    });

    if (input.id_sucursal) {
      empleado.sucursal = await this.sucursalesService.findOne(
        input.id_sucursal,
      );
    }

    return this.empleadoRepository.save(empleado);
  }

  async update(input: UpdateEmpleadoInput): Promise<Empleado> {
    const empleado = await this.findOne(input.id_usuario);

    if (input.id_sucursal) {
      empleado.sucursal = await this.sucursalesService.findOne(
        input.id_sucursal,
      );
    }

    Object.assign(empleado, input);
    return this.empleadoRepository.save(empleado);
  }

  async toggleActivo(id_usuario: number): Promise<Empleado> {
    const empleado = await this.findOne(id_usuario);
    empleado.activo = !empleado.activo;
    return this.empleadoRepository.save(empleado);
  }
}