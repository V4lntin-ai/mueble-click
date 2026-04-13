import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from './entities/ordenes-compra.entity';
import { CreateOrdenCompraInput } from './dto/create-ordenes-compra.input';
import { UpdateOrdenCompraInput } from './dto/update-ordenes-compra.input';
import { ProveedoresService } from '../proveedores/proveedores.service';
import { SucursalesService } from '../sucursales/sucursales.service';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly repo: Repository<OrdenCompra>,
    private readonly proveedoresService: ProveedoresService,
    private readonly sucursalesService: SucursalesService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async findAll(): Promise<OrdenCompra[]> {
    return this.repo.find({ order: { fecha_orden: 'DESC' } });
  }

  async findOne(id_orden: number): Promise<OrdenCompra> {
    const orden = await this.repo.findOneBy({ id_orden });
    if (!orden)
      throw new NotFoundException(`Orden de compra #${id_orden} no encontrada`);
    return orden;
  }

  async findBySucursal(id_sucursal: number): Promise<OrdenCompra[]> {
    return this.repo.find({
      where: { sucursal: { id_sucursal } },
      order: { fecha_orden: 'DESC' },
    });
  }

  async findByProveedor(id_proveedor: number): Promise<OrdenCompra[]> {
    return this.repo.find({
      where: { proveedor: { id_proveedor } },
      order: { fecha_orden: 'DESC' },
    });
  }

  async create(
    input: CreateOrdenCompraInput,
    id_usuario: number,
  ): Promise<OrdenCompra> {
    const proveedor = await this.proveedoresService.findOne(input.id_proveedor);
    const sucursal = await this.sucursalesService.findOne(input.id_sucursal);
    const creado_por = await this.usuariosService.findOne(id_usuario);

    const orden = this.repo.create({
      proveedor,
      sucursal,
      creado_por,
      fecha_recepcion_esperada: input.fecha_recepcion_esperada,
      estado: 'Pendiente',
      total: 0,
    });

    return this.repo.save(orden);
  }

  async updateEstado(input: UpdateOrdenCompraInput): Promise<OrdenCompra> {
    const orden = await this.findOne(input.id_orden);

    const estadosValidos = ['Enviada', 'Recibida', 'Cancelada'];
    if (!estadosValidos.includes(input.estado))
      throw new BadRequestException(
        `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
      );

    orden.estado = input.estado;
    return this.repo.save(orden);
  }

  async actualizarTotal(id_orden: number, total: number): Promise<OrdenCompra> {
    const orden = await this.findOne(id_orden);
    orden.total = total;
    return this.repo.save(orden);
  }
}