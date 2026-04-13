import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateDetalleVentaInput } from './dto/create-detalle-venta.input';
import { VentasService } from '../ventas/ventas.service';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly repo: Repository<DetalleVenta>,
    private readonly ventasService: VentasService,
    private readonly productosService: ProductosService,
  ) {}

  async findByVenta(id_venta: number): Promise<DetalleVenta[]> {
    return this.repo.find({
      where: { venta: { id_venta } },
    });
  }

  async findOne(id_detalle_venta: number): Promise<DetalleVenta> {
    const detalle = await this.repo.findOneBy({ id_detalle_venta });
    if (!detalle)
      throw new NotFoundException(
        `Detalle de venta #${id_detalle_venta} no encontrado`,
      );
    return detalle;
  }

  async create(input: CreateDetalleVentaInput): Promise<DetalleVenta> {
    const venta = await this.ventasService.findOne(input.id_venta);
    const producto = await this.productosService.findOne(input.id_producto);

    const precio_unitario = Number(producto.precio_venta);
    const cantidad = Number(input.cantidad);
    const subtotal = Number((precio_unitario * cantidad).toFixed(2));

    const detalle = this.repo.create({
      venta,
      producto,
      cantidad,
      precio_unitario,
      subtotal,
    });

    return this.repo.save(detalle);
  }
}