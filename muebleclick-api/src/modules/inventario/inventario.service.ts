import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioInput } from './dto/create-inventario.input';
import { UpdateInventarioInput } from './dto/update-inventario.input';
import { SucursalesService } from '../sucursales/sucursales.service';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    private readonly sucursalesService: SucursalesService,
    private readonly productosService: ProductosService,
  ) {}

  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepository.find();
  }

  async findOne(id_inventario: number): Promise<Inventario> {
    const inv = await this.inventarioRepository.findOneBy({ id_inventario });
    if (!inv)
      throw new NotFoundException(`Inventario #${id_inventario} no encontrado`);
    return inv;
  }

  async findBySucursal(id_sucursal: number): Promise<Inventario[]> {
    return this.inventarioRepository.find({
      where: { sucursal: { id_sucursal } },
    });
  }

  async findByProducto(id_producto: number): Promise<Inventario[]> {
    return this.inventarioRepository.find({
      where: { producto: { id_producto } },
    });
  }

  async findBySucursalYProducto(
    id_sucursal: number,
    id_producto: number,
  ): Promise<Inventario | null> {
    return this.inventarioRepository.findOne({
      where: {
        sucursal: { id_sucursal },
        producto: { id_producto },
      },
    });
  }

  // Productos bajo stock mínimo en una sucursal
  async findStockCritico(id_sucursal: number): Promise<Inventario[]> {
    return this.inventarioRepository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.sucursal', 'sucursal')
      .leftJoinAndSelect('inv.producto', 'producto')
      .where('sucursal.id_sucursal = :id_sucursal', { id_sucursal })
      .andWhere('inv.cantidad <= inv.stock_min')
      .getMany();
  }

  async create(input: CreateInventarioInput): Promise<Inventario> {
    const sucursal = await this.sucursalesService.findOne(input.id_sucursal);
    const producto = await this.productosService.findOne(input.id_producto);

    const existe = await this.findBySucursalYProducto(
      input.id_sucursal,
      input.id_producto,
    );
    if (existe)
      throw new ConflictException(
        `Ya existe inventario para el producto #${input.id_producto} en la sucursal #${input.id_sucursal}`,
      );

    const inventario = this.inventarioRepository.create({
      sucursal,
      producto,
      cantidad: input.cantidad ?? 0,
      stock_min: input.stock_min ?? 0,
      stock_max: input.stock_max ?? 0,
    });

    return this.inventarioRepository.save(inventario);
  }

  async update(input: UpdateInventarioInput): Promise<Inventario> {
    const inventario = await this.findOne(input.id_inventario);
    Object.assign(inventario, input);
    return this.inventarioRepository.save(inventario);
  }

  // Ajuste directo de cantidad — usado por movimientos
  async ajustarCantidad(
    id_inventario: number,
    delta: number,
  ): Promise<Inventario> {
    const inventario = await this.findOne(id_inventario);
    const nueva_cantidad = inventario.cantidad + delta;

    if (nueva_cantidad < 0)
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${inventario.cantidad}`,
      );

    inventario.cantidad = nueva_cantidad;
    return this.inventarioRepository.save(inventario);
  }

  // Reservar unidades durante checkout
  async reservar(id_inventario: number, cantidad: number): Promise<Inventario> {
    const inventario = await this.findOne(id_inventario);
    const disponible = inventario.cantidad - inventario.reservado;

    if (cantidad > disponible)
      throw new BadRequestException(
        `Stock disponible insuficiente. Disponible: ${disponible}`,
      );

    inventario.reservado += cantidad;
    return this.inventarioRepository.save(inventario);
  }

  // Liberar reserva
  async liberarReserva(
    id_inventario: number,
    cantidad: number,
  ): Promise<Inventario> {
    const inventario = await this.findOne(id_inventario);
    inventario.reservado = Math.max(0, inventario.reservado - cantidad);
    return this.inventarioRepository.save(inventario);
  }
}