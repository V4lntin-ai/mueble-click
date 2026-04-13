import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleOrdenCompra } from './entities/detalle-orden-compra.entity';
import { CreateDetalleOrdenCompraInput } from './dto/create-detalle-orden-compra.input';
import { OrdenesCompraService } from '../ordenes-compra/ordenes-compra.service';
import { ProductosService } from '../productos/productos.service';
import { MateriasPrimasService } from '../materias-primas/materias-primas.service';

@Injectable()
export class DetalleOrdenCompraService {
  constructor(
    @InjectRepository(DetalleOrdenCompra)
    private readonly repo: Repository<DetalleOrdenCompra>,
    private readonly ordenesCompraService: OrdenesCompraService,
    private readonly productosService: ProductosService,
    private readonly materiasPrimasService: MateriasPrimasService,
  ) {}

  async findByOrden(id_orden: number): Promise<DetalleOrdenCompra[]> {
    return this.repo.find({
      where: { orden: { id_orden } },
    });
  }

  async findOne(id_detalle: number): Promise<DetalleOrdenCompra> {
    const detalle = await this.repo.findOneBy({ id_detalle });
    if (!detalle)
      throw new NotFoundException(`Detalle #${id_detalle} no encontrado`);
    return detalle;
  }

  async create(
    input: CreateDetalleOrdenCompraInput,
  ): Promise<DetalleOrdenCompra> {
    if (!input.id_producto && !input.id_materia)
      throw new BadRequestException(
        'Debe especificar id_producto o id_materia',
      );

    const orden = await this.ordenesCompraService.findOne(input.id_orden);

    const detalle = this.repo.create({
      orden,
      cantidad: input.cantidad,
      precio_unitario: input.precio_unitario,
      subtotal: input.cantidad * input.precio_unitario,
    });

    if (input.id_producto) {
      detalle.producto = await this.productosService.findOne(input.id_producto);
    }

    if (input.id_materia) {
      detalle.materia_prima = await this.materiasPrimasService.findOne(
        input.id_materia,
      );
    }

    const saved = await this.repo.save(detalle);

    // Recalcular total de la orden
    const detalles = await this.findByOrden(input.id_orden);
    const total = detalles.reduce((sum, d) => sum + Number(d.subtotal), 0);
    await this.ordenesCompraService.actualizarTotal(input.id_orden, total);

    return saved;
  }

  async remove(id_detalle: number): Promise<boolean> {
    const detalle = await this.findOne(id_detalle);
    const id_orden = detalle.orden.id_orden;
    await this.repo.remove(detalle);

    // Recalcular total
    const detalles = await this.findByOrden(id_orden);
    const total = detalles.reduce((sum, d) => sum + Number(d.subtotal), 0);
    await this.ordenesCompraService.actualizarTotal(id_orden, total);

    return true;
  }
}