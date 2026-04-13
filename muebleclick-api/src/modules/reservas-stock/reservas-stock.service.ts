import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { ReservaStock } from './entities/reservas-stock.entity';
import { CreateReservaStockInput } from './dto/create-reservas-stock.input';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class ReservasStockService {
  constructor(
    @InjectRepository(ReservaStock)
    private readonly repo: Repository<ReservaStock>,
    private readonly productosService: ProductosService,
  ) {}

  async findAll(): Promise<ReservaStock[]> {
    return this.repo.find();
  }

  async findOne(id_reserva: number): Promise<ReservaStock> {
    const reserva = await this.repo.findOneBy({ id_reserva });
    if (!reserva)
      throw new NotFoundException(`Reserva #${id_reserva} no encontrada`);
    return reserva;
  }

  async findByPedido(id_pedido: number): Promise<ReservaStock[]> {
    return this.repo.findBy({ id_pedido });
  }

  async findExpiradas(): Promise<ReservaStock[]> {
    return this.repo.findBy({
      fecha_expira: LessThan(new Date()),
    });
  }

  async create(input: CreateReservaStockInput): Promise<ReservaStock> {
    const producto = await this.productosService.findOne(input.id_producto);

    // Reserva expira en 15 minutos
    const fecha_expira = new Date();
    fecha_expira.setMinutes(fecha_expira.getMinutes() + 15);

    const reserva = this.repo.create({
      id_pedido: input.id_pedido,
      producto,
      cantidad: input.cantidad,
      fecha_expira,
    });

    return this.repo.save(reserva);
  }

  async liberar(id_reserva: number): Promise<boolean> {
    const reserva = await this.findOne(id_reserva);
    await this.repo.remove(reserva);
    return true;
  }

  async limpiarExpiradas(): Promise<number> {
    const expiradas = await this.findExpiradas();
    if (expiradas.length === 0) return 0;
    await this.repo.remove(expiradas);
    return expiradas.length;
  }
}