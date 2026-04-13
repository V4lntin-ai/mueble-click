import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedidos.entity';
import { CreatePedidoInput } from './dto/create-pedidos.input';
import { UpdatePedidoInput } from './dto/update-pedidos.input';
import { ClienteService } from '../cliente/cliente.service';
import { DireccionesEnvioService } from '../direcciones-envio/direcciones-envio.service';
import { SucursalesService } from '../sucursales/sucursales.service';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly repo: Repository<Pedido>,
    private readonly clienteService: ClienteService,
    private readonly direccionesService: DireccionesEnvioService,
    private readonly sucursalesService: SucursalesService,
  ) {}

  async findAll(): Promise<Pedido[]> {
    return this.repo.find({ order: { fecha_pedido: 'DESC' } });
  }

  async findOne(id_pedido: number): Promise<Pedido> {
    const pedido = await this.repo.findOneBy({ id_pedido });
    if (!pedido)
      throw new NotFoundException(`Pedido #${id_pedido} no encontrado`);
    return pedido;
  }

  async findByCliente(id_cliente: number): Promise<Pedido[]> {
    return this.repo.find({
      where: { cliente: { id_usuario: id_cliente } },
      order: { fecha_pedido: 'DESC' },
    });
  }

  async findBySucursal(id_sucursal: number): Promise<Pedido[]> {
    return this.repo.find({
      where: { sucursal_origen: { id_sucursal } },
      order: { fecha_pedido: 'DESC' },
    });
  }

  async findByEstado(estado_pedido: string): Promise<Pedido[]> {
    return this.repo.findBy({ estado_pedido });
  }

  async create(
    input: CreatePedidoInput,
    id_usuario: number,
  ): Promise<Pedido> {
    const cliente = await this.clienteService.findOne(id_usuario);

    const pedido = this.repo.create({
      cliente,
      tipo_entrega: input.tipo_entrega ?? 'Envio',
      estado_pedido: 'Pendiente',
      total: 0,
    });

    if (input.id_direccion) {
      const direccion = await this.direccionesService.findOne(
        input.id_direccion,
      );
      if (direccion.cliente.id_usuario !== id_usuario)
        throw new ForbiddenException(
          'La dirección no pertenece a este cliente',
        );
      pedido.direccion = direccion;
    }

    if (input.id_sucursal_origen) {
      pedido.sucursal_origen = await this.sucursalesService.findOne(
        input.id_sucursal_origen,
      );
    }

    return this.repo.save(pedido);
  }

  async updateEstado(input: UpdatePedidoInput): Promise<Pedido> {
    const pedido = await this.findOne(input.id_pedido);

    const estadosValidos = [
      'Confirmado',
      'Enviado',
      'Entregado',
      'Cancelado',
    ];
    if (!estadosValidos.includes(input.estado_pedido))
      throw new BadRequestException(
        `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
      );

    pedido.estado_pedido = input.estado_pedido;
    return this.repo.save(pedido);
  }

  async actualizarTotal(id_pedido: number, total: number): Promise<Pedido> {
    const pedido = await this.findOne(id_pedido);
    pedido.total = total;
    return this.repo.save(pedido);
  }

  async cancelar(id_pedido: number, id_usuario: number): Promise<Pedido> {
    const pedido = await this.findOne(id_pedido);

    if (pedido.cliente.id_usuario !== id_usuario)
      throw new ForbiddenException('No puedes cancelar este pedido');

    if (['Enviado', 'Entregado'].includes(pedido.estado_pedido))
      throw new BadRequestException(
        'No se puede cancelar un pedido ya enviado o entregado',
      );

    pedido.estado_pedido = 'Cancelado';
    return this.repo.save(pedido);
  }
}