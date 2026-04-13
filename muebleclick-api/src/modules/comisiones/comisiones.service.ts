import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comision } from './entities/comisiones.entity';
import { CreateComisionInput } from './dto/create-comisiones.input';
import { VentasService } from '../ventas/ventas.service';
import { EmpleadoService } from '../empleado/empleado.service';

@Injectable()
export class ComisionesService {
  constructor(
    @InjectRepository(Comision)
    private readonly repo: Repository<Comision>,
    private readonly ventasService: VentasService,
    private readonly empleadoService: EmpleadoService,
  ) {}

  async findAll(): Promise<Comision[]> {
    return this.repo.find({ order: { fecha: 'DESC' } });
  }

  async findOne(id_comision: number): Promise<Comision> {
    const comision = await this.repo.findOneBy({ id_comision });
    if (!comision)
      throw new NotFoundException(`Comisión #${id_comision} no encontrada`);
    return comision;
  }

  async findByVendedor(id_vendedor: number): Promise<Comision[]> {
    return this.repo.find({
      where: { vendedor: { id_usuario: id_vendedor } },
      order: { fecha: 'DESC' },
    });
  }

  async findPendientesByVendedor(id_vendedor: number): Promise<Comision[]> {
    return this.repo.find({
      where: {
        vendedor: { id_usuario: id_vendedor },
        pagada: false,
      },
    });
  }

  async create(input: CreateComisionInput): Promise<Comision> {
    const venta = await this.ventasService.findOne(input.id_venta);
    const vendedor = await this.empleadoService.findOne(input.id_vendedor);

    const comision = this.repo.create({
      venta,
      vendedor,
      porcentaje: input.porcentaje,
      monto: input.monto,
      pagada: false,
    });

    return this.repo.save(comision);
  }

  async marcarPagada(id_comision: number): Promise<Comision> {
    const comision = await this.findOne(id_comision);
    comision.pagada = true;
    return this.repo.save(comision);
  }
}