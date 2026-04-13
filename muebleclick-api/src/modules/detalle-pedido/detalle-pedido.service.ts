import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { CreateDetallePedidoInput } from './dto/create-detalle-pedido.input';
import { PedidosService } from '../pedidos/pedidos.service';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class DetallePedidoService {
  constructor(
    @InjectRepository(DetallePedido)
    private readonly repo: Repository<DetallePedido>,
    private readonly pedidosService: PedidosService,
    private readonly productosService: ProductosService,
  ) {}

  async findByPedido(id_pedido: number): Promise<DetallePedido[]> {
    return this.repo.find({
      where: { pedido: { id_pedido } },
    });
  }

  async findOne(id_detalle_pedido: number): Promise<DetallePedido> {
    const detalle = await this.repo.findOneBy({ id_detalle_pedido });
    if (!detalle)
      throw new NotFoundException(`Detalle #${id_detalle_pedido} no encontrado`);
    return detalle;
  }

  async create(input: CreateDetallePedidoInput): Promise<DetallePedido> {
    const pedido = await this.pedidosService.findOne(input.id_pedido);
    const producto = await this.productosService.findOne(input.id_producto);

    const precio_unitario = Number(producto.precio_venta);
    const cantidad = Number(input.cantidad);
    const subtotal = Number((precio_unitario * cantidad).toFixed(2));

    const detalle = this.repo.create({
        pedido,
        producto,
        cantidad,
        precio_unitario,
        subtotal,
    });

    const saved = await this.repo.save(detalle);

    // Recalcular total del pedido
    const detalles = await this.findByPedido(input.id_pedido);
    const total = Number(
        detalles.reduce((sum, d) => sum + Number(d.subtotal), 0).toFixed(2),
    );
    await this.pedidosService.actualizarTotal(input.id_pedido, total);

    return saved;
    }

  async remove(id_detalle_pedido: number): Promise<boolean> {
    const detalle = await this.findOne(id_detalle_pedido);
    const id_pedido = detalle.pedido.id_pedido;
    await this.repo.remove(detalle);

    const detalles = await this.findByPedido(id_pedido);
    const total = detalles.reduce(
      (sum, d) => sum + Number(d.cantidad) * Number(d.precio_unitario),
      0,
    );
    await this.pedidosService.actualizarTotal(id_pedido, total);

    return true;
  }
}