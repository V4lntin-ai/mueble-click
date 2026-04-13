import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenProduccion } from './entities/ordenes-produccion.entity';
import { CreateOrdenProduccionInput } from './dto/create-ordenes-produccion.input';
import { UpdateOrdenProduccionInput } from './dto/update-ordenes-produccion.input';
import { ProductosService } from '../productos/productos.service';
import { SucursalesService } from '../sucursales/sucursales.service';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class OrdenesProduccionService {
  constructor(
    @InjectRepository(OrdenProduccion)
    private readonly repo: Repository<OrdenProduccion>,
    private readonly productosService: ProductosService,
    private readonly sucursalesService: SucursalesService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async findAll(): Promise<OrdenProduccion[]> {
    return this.repo.find({ order: { fecha_programada: 'DESC' } });
  }

  async findOne(id_produccion: number): Promise<OrdenProduccion> {
    const orden = await this.repo.findOneBy({ id_produccion });
    if (!orden)
      throw new NotFoundException(
        `Orden de producción #${id_produccion} no encontrada`,
      );
    return orden;
  }

  async findBySucursal(id_sucursal: number): Promise<OrdenProduccion[]> {
    return this.repo.find({
      where: { sucursal: { id_sucursal } },
      order: { fecha_programada: 'DESC' },
    });
  }

  async findByEstado(estado: string): Promise<OrdenProduccion[]> {
    return this.repo.findBy({ estado });
  }

  async create(
    input: CreateOrdenProduccionInput,
    id_usuario: number,
  ): Promise<OrdenProduccion> {
    const producto = await this.productosService.findOne(input.id_producto);
    const sucursal = await this.sucursalesService.findOne(input.id_sucursal);
    const creado_por = await this.usuariosService.findOne(id_usuario);

    const orden = this.repo.create({
      producto,
      sucursal,
      creado_por,
      cantidad_planificada: input.cantidad_planificada,
      fecha_programada: input.fecha_programada,
      notas: input.notas,
      estado: 'Planificada',
    });

    return this.repo.save(orden);
  }

  async updateEstado(
    input: UpdateOrdenProduccionInput,
  ): Promise<OrdenProduccion> {
    const orden = await this.findOne(input.id_produccion);

    const estadosValidos = ['En_proceso', 'Completada', 'Cancelada'];
    if (!estadosValidos.includes(input.estado))
      throw new BadRequestException(
        `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
      );

    // Marcar timestamps automáticamente
    if (input.estado === 'En_proceso' && !orden.fecha_inicio) {
      orden.fecha_inicio = new Date();
    }
    if (input.estado === 'Completada' && !orden.fecha_fin) {
      orden.fecha_fin = new Date();
    }

    if (input.notas) orden.notas = input.notas;
    orden.estado = input.estado;

    return this.repo.save(orden);
  }
}