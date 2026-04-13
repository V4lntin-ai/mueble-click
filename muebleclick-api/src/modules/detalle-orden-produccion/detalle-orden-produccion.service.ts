import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleOrdenProduccion } from './entities/detalle-orden-produccion.entity';
import { CreateDetalleOrdenProduccionInput } from './dto/create-detalle-orden-produccion.input';
import { OrdenesProduccionService } from '../ordenes-produccion/ordenes-produccion.service';
import { MateriasPrimasService } from '../materias-primas/materias-primas.service';

@Injectable()
export class DetalleOrdenProduccionService {
  constructor(
    @InjectRepository(DetalleOrdenProduccion)
    private readonly repo: Repository<DetalleOrdenProduccion>,
    private readonly ordenesProduccionService: OrdenesProduccionService,
    private readonly materiasPrimasService: MateriasPrimasService,
  ) {}

  async findByOrden(id_produccion: number): Promise<DetalleOrdenProduccion[]> {
    return this.repo.find({
      where: { orden_produccion: { id_produccion } },
    });
  }

  async findOne(id_detalle: number): Promise<DetalleOrdenProduccion> {
    const detalle = await this.repo.findOneBy({ id_detalle });
    if (!detalle)
      throw new NotFoundException(`Detalle #${id_detalle} no encontrado`);
    return detalle;
  }

  async create(
    input: CreateDetalleOrdenProduccionInput,
  ): Promise<DetalleOrdenProduccion> {
    const orden_produccion = await this.ordenesProduccionService.findOne(
      input.id_produccion,
    );
    const materia_prima = await this.materiasPrimasService.findOne(
      input.id_materia,
    );

    const detalle = this.repo.create({
      orden_produccion,
      materia_prima,
      cantidad_requerida: input.cantidad_requerida,
      cantidad_consumida: 0,
      unidad: input.unidad,
    });

    return this.repo.save(detalle);
  }

  async registrarConsumo(
    id_detalle: number,
    cantidad_consumida: number,
  ): Promise<DetalleOrdenProduccion> {
    const detalle = await this.findOne(id_detalle);
    detalle.cantidad_consumida = cantidad_consumida;
    return this.repo.save(detalle);
  }

  async remove(id_detalle: number): Promise<boolean> {
    const detalle = await this.findOne(id_detalle);
    await this.repo.remove(detalle);
    return true;
  }
}