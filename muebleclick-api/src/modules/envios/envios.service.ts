import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envio } from './entities/envios.entity';
import { CreateEnvioInput } from './dto/create-envios.input';
import { UpdateEnvioInput } from './dto/update-envios.input';
import { VentasService } from '../ventas/ventas.service';
import { PaqueteriasService } from '../paqueterias/paqueterias.service';
import { DireccionesEnvioService } from '../direcciones-envio/direcciones-envio.service';

@Injectable()
export class EnviosService {
  constructor(
    @InjectRepository(Envio)
    private readonly repo: Repository<Envio>,
    private readonly ventasService: VentasService,
    private readonly paqueteriasService: PaqueteriasService,
    private readonly direccionesService: DireccionesEnvioService,
  ) {}

  async findAll(): Promise<Envio[]> {
    return this.repo.find();
  }

  async findOne(id_envio: number): Promise<Envio> {
    const envio = await this.repo.findOneBy({ id_envio });
    if (!envio)
      throw new NotFoundException(`Envío #${id_envio} no encontrado`);
    return envio;
  }

  async findByVenta(id_venta: number): Promise<Envio | null> {
    return this.repo.findOne({
      where: { venta: { id_venta } },
    });
  }

  async create(input: CreateEnvioInput): Promise<Envio> {
    const venta = await this.ventasService.findOne(input.id_venta);
    const paqueteria = await this.paqueteriasService.findOne(
      input.id_paqueteria,
    );
    const direccion = await this.direccionesService.findOne(input.id_direccion);

    const envio = this.repo.create({
      venta,
      paqueteria,
      direccion,
      fecha_envio: new Date(),
      fecha_entrega_estimada: input.fecha_entrega_estimada,
      tracking_number: input.tracking_number,
      costo_envio: input.costo_envio ?? 0,
      seguro: input.seguro ?? false,
      nota: input.nota,
      estado_envio: 'Preparando',
    });

    return this.repo.save(envio);
  }

  async updateEstado(input: UpdateEnvioInput): Promise<Envio> {
    const envio = await this.findOne(input.id_envio);

    const estadosValidos = ['En_camino', 'Entregado', 'Devuelto'];
    if (!estadosValidos.includes(input.estado_envio))
      throw new BadRequestException(
        `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
      );

    envio.estado_envio = input.estado_envio;
    if (input.fecha_entrega_real)
      envio.fecha_entrega_real = input.fecha_entrega_real;
    if (input.tracking_number)
      envio.tracking_number = input.tracking_number;

    return this.repo.save(envio);
  }
}