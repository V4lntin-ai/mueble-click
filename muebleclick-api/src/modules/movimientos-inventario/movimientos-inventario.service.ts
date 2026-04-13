import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoInventario } from './entities/movimientos-inventario.entity';
import { CreateMovimientoInventarioInput } from './dto/create-movimientos-inventario.input';
import { SucursalesService } from '../sucursales/sucursales.service';
import { ProductosService } from '../productos/productos.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { InventarioService } from '../inventario/inventario.service';

@Injectable()
export class MovimientosInventarioService {
  constructor(
    @InjectRepository(MovimientoInventario)
    private readonly repo: Repository<MovimientoInventario>,
    private readonly sucursalesService: SucursalesService,
    private readonly productosService: ProductosService,
    private readonly usuariosService: UsuariosService,
    private readonly inventarioService: InventarioService,
  ) {}

  async findAll(): Promise<MovimientoInventario[]> {
    return this.repo.find();
  }

  async findOne(id_movimiento: number): Promise<MovimientoInventario> {
    const mov = await this.repo.findOneBy({ id_movimiento });
    if (!mov)
      throw new NotFoundException(
        `Movimiento #${id_movimiento} no encontrado`,
      );
    return mov;
  }

  async findBySucursal(id_sucursal: number): Promise<MovimientoInventario[]> {
    return this.repo.find({
      where: { sucursal: { id_sucursal } },
      order: { fecha: 'DESC' },
    });
  }

  async findByProducto(id_producto: number): Promise<MovimientoInventario[]> {
    return this.repo.find({
      where: { producto: { id_producto } },
      order: { fecha: 'DESC' },
    });
  }

  async create(
    input: CreateMovimientoInventarioInput,
    id_usuario: number,
  ): Promise<MovimientoInventario> {
    const sucursal = await this.sucursalesService.findOne(input.id_sucursal);
    const producto = await this.productosService.findOne(input.id_producto);
    const usuario = await this.usuariosService.findOne(id_usuario);

    // Buscar registro de inventario
    const inventario = await this.inventarioService.findBySucursalYProducto(
      input.id_sucursal,
      input.id_producto,
    );

    if (!inventario)
      throw new BadRequestException(
        `No existe inventario para el producto #${input.id_producto} en la sucursal #${input.id_sucursal}`,
      );

    // Aplicar el delta según tipo
    const delta =
      input.tipo === 'entrada'
        ? input.cantidad
        : input.tipo === 'salida'
        ? -input.cantidad
        : input.cantidad; // ajuste puede ser positivo o negativo — usar cantidad firmada

    await this.inventarioService.ajustarCantidad(
      inventario.id_inventario,
      delta,
    );

    const movimiento = this.repo.create({
      sucursal,
      producto,
      tipo: input.tipo,
      cantidad: input.cantidad,
      referencia_tipo: input.referencia_tipo,
      referencia_id: input.referencia_id,
      usuario,
      nota: input.nota,
    });

    return this.repo.save(movimiento);
  }
}