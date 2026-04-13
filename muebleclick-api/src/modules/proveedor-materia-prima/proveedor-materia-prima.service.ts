import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProveedorMateriaPrima } from './entities/proveedor-materia-prima.entity';
import { CreateProveedorMateriaPrimaInput } from './dto/create-proveedor-materia-prima.input';
import { ProveedoresService } from '../proveedores/proveedores.service';
import { MateriasPrimasService } from '../materias-primas/materias-primas.service';

@Injectable()
export class ProveedorMateriaPrimaService {
  constructor(
    @InjectRepository(ProveedorMateriaPrima)
    private readonly repo: Repository<ProveedorMateriaPrima>,
    private readonly proveedoresService: ProveedoresService,
    private readonly materiasPrimasService: MateriasPrimasService,
  ) {}

  async findAll(): Promise<ProveedorMateriaPrima[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<ProveedorMateriaPrima> {
    const item = await this.repo.findOneBy({ id });
    if (!item)
      throw new NotFoundException(
        `ProveedorMateriaPrima #${id} no encontrado`,
      );
    return item;
  }

  async findByMateria(id_materia: number): Promise<ProveedorMateriaPrima[]> {
    return this.repo.find({
      where: { materia_prima: { id_materia } },
    });
  }

  async findByProveedor(
    id_proveedor: number,
  ): Promise<ProveedorMateriaPrima[]> {
    return this.repo.find({
      where: { proveedor: { id_proveedor } },
    });
  }

  async create(
    input: CreateProveedorMateriaPrimaInput,
  ): Promise<ProveedorMateriaPrima> {
    const proveedor = await this.proveedoresService.findOne(input.id_proveedor);
    const materia_prima = await this.materiasPrimasService.findOne(
      input.id_materia,
    );

    const item = this.repo.create({
      proveedor,
      materia_prima,
      codigo_proveedor: input.codigo_proveedor,
      precio_compra: input.precio_compra,
      lead_time_days: input.lead_time_days,
      min_cantidad_pedido: input.min_cantidad_pedido,
      activo: input.activo ?? true,
    });

    return this.repo.save(item);
  }

  async toggleActivo(id: number): Promise<ProveedorMateriaPrima> {
    const item = await this.findOne(id);
    item.activo = !item.activo;
    return this.repo.save(item);
  }

  async remove(id: number): Promise<boolean> {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return true;
  }
}