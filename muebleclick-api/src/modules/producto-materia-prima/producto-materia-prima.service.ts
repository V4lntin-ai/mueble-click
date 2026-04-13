import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoMateriaPrima } from './entities/producto-materia-prima.entity';
import { CreateProductoMateriaPrimaInput } from './dto/create-producto-materia-prima.input';
import { ProductosService } from '../productos/productos.service';
import { MateriasPrimasService } from '../materias-primas/materias-primas.service';

@Injectable()
export class ProductoMateriaPrimaService {
  constructor(
    @InjectRepository(ProductoMateriaPrima)
    private readonly repo: Repository<ProductoMateriaPrima>,
    private readonly productosService: ProductosService,
    private readonly materiasPrimasService: MateriasPrimasService,
  ) {}

  async findAll(): Promise<ProductoMateriaPrima[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<ProductoMateriaPrima> {
    const item = await this.repo.findOneBy({ id });
    if (!item)
      throw new NotFoundException(`BOM #${id} no encontrado`);
    return item;
  }

  // BOM completo de un producto
  async findByProducto(id_producto: number): Promise<ProductoMateriaPrima[]> {
    return this.repo.find({
      where: { producto: { id_producto } },
    });
  }

  async create(
    input: CreateProductoMateriaPrimaInput,
  ): Promise<ProductoMateriaPrima> {
    const producto = await this.productosService.findOne(input.id_producto);
    const materia_prima = await this.materiasPrimasService.findOne(
      input.id_materia,
    );

    const item = this.repo.create({
      producto,
      materia_prima,
      cantidad_por_unidad: input.cantidad_por_unidad,
      unidad: input.unidad,
    });

    return this.repo.save(item);
  }

  async remove(id: number): Promise<boolean> {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return true;
  }
}