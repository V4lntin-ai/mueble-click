import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/ventas.entity';
import { CreateVentaInput } from './dto/create-ventas.input';
import { UpdateVentaInput } from './dto/update-ventas.input';
import { ClienteService } from '../cliente/cliente.service';
import { PedidosService } from '../pedidos/pedidos.service';
import { MetodoPagoService } from '../metodo-pago/metodo-pago.service';
import { CuponesService } from '../cupones/cupones.service';
import { EmpleadoService } from '../empleado/empleado.service';
import { DetallePedidoService } from '../detalle-pedido/detalle-pedido.service';
import { Pedido } from '../pedidos/entities/pedidos.entity';
import { Cupon } from '../cupones/entities/cupones.entity';
import { Empleado } from '../empleado/entities/empleado.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly repo: Repository<Venta>,
    private readonly clienteService: ClienteService,
    private readonly pedidosService: PedidosService,
    private readonly metodoPagoService: MetodoPagoService,
    private readonly cuponesService: CuponesService,
    private readonly empleadoService: EmpleadoService,
    private readonly detallePedidoService: DetallePedidoService,
  ) {}

  async findAll(): Promise<Venta[]> {
    return this.repo.find({ order: { fecha_venta: 'DESC' } });
  }

  async findOne(id_venta: number): Promise<Venta> {
    const venta = await this.repo.findOneBy({ id_venta });
    if (!venta)
      throw new NotFoundException(`Venta #${id_venta} no encontrada`);
    return venta;
  }

  async findByCliente(id_cliente: number): Promise<Venta[]> {
    return this.repo.find({
      where: { cliente: { id_usuario: id_cliente } },
      order: { fecha_venta: 'DESC' },
    });
  }

  async findByVendedor(id_vendedor: number): Promise<Venta[]> {
    return this.repo.find({
      where: { vendedor: { id_usuario: id_vendedor } },
      order: { fecha_venta: 'DESC' },
    });
  }

  async create(
    input: CreateVentaInput,
    id_usuario: number,
  ): Promise<Venta> {
    const cliente = await this.clienteService.findOne(id_usuario);
    const metodo_pago = await this.metodoPagoService.findOne(
      input.id_metodo_pago,
    );

    let sub_total = 0;
    let pedido: Pedido | undefined;

    if (input.id_pedido) {
      pedido = await this.pedidosService.findOne(input.id_pedido);
      sub_total = Number(pedido.total);
    }

    // Aplicar cupón si existe
    let descuento = 0;
    let cupon: Cupon | undefined;
    if (input.codigo_cupon) {
      cupon = await this.cuponesService.validar(input.codigo_cupon);
      descuento = Number(
        ((sub_total * Number(cupon.descuento_porcentaje)) / 100).toFixed(2),
      );
    }

    const total_venta = Number((sub_total - descuento).toFixed(2));

    // Calcular comisión si hay vendedor
    let comision: number | undefined;
    let vendedor: Empleado | undefined;
    if (input.id_vendedor) {
      vendedor = await this.empleadoService.findOne(input.id_vendedor);
      if (vendedor.comision_pct) {
        comision = Number(
          ((total_venta * Number(vendedor.comision_pct)) / 100).toFixed(2),
        );
      }
    }

    const venta = this.repo.create({
      cliente,
      pedido,
      metodo_pago,
      cupon,
      vendedor,
      sub_total,
      descuento,
      total_venta,
      comision,
      estado_venta: 'Completada',
    });

    const saved = await this.repo.save(venta);

    // Confirmar el pedido
    if (pedido) {
      await this.pedidosService.updateEstado({
        id_pedido: pedido.id_pedido,
        estado_pedido: 'Confirmado',
      });
    }

    return saved;
  }

  async updateEstado(input: UpdateVentaInput): Promise<Venta> {
    const venta = await this.findOne(input.id_venta);

    const estadosValidos = ['Reembolsada', 'Cancelada'];
    if (!estadosValidos.includes(input.estado_venta))
      throw new BadRequestException(
        `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
      );

    venta.estado_venta = input.estado_venta;
    return this.repo.save(venta);
  }
}