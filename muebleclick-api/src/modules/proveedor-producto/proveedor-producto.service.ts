import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProveedorProducto } from './entities/proveedor-producto.entity';
import { CreateProveedorProductoInput } from './dto/create-proveedor-producto.input';
import { ProveedoresService } from '../proveedores/proveedores.service';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class ProveedorProductoService {
  constructor(
    @InjectRepository(ProveedorProducto)
    private readonly repo: Repository<ProveedorProducto>,
    private readonly proveedoresService: ProveedoresService,
    private readonly productosService: ProductosService,
  ) {}

  async findAll(): Promise<ProveedorProducto[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<ProveedorProducto> {
    const item = await this.repo.findOneBy({ id });
    if (!item)
      throw new NotFoundException(`ProveedorProducto #${id} no encontrado`);
    return item;
  }

  async findByProducto(id_producto: number): Promise<ProveedorProducto[]> {
    return this.repo.find({
      where: { producto: { id_producto } },
    });
  }

  async findByProveedor(id_proveedor: number): Promise<ProveedorProducto[]> {
    return this.repo.find({
      where: { proveedor: { id_proveedor } },
    });
  }

  async create(input: CreateProveedorProductoInput): Promise<ProveedorProducto> {
    const proveedor = await this.proveedoresService.findOne(input.id_proveedor);
    const producto = await this.productosService.findOne(input.id_producto);

    const item = this.repo.create({
      proveedor,
      producto,
      codigo_proveedor: input.codigo_proveedor,
      precio_compra: input.precio_compra,
      lead_time_days: input.lead_time_days,
      min_cantidad_pedido: input.min_cantidad_pedido,
      activo: input.activo ?? true,
    });

    return this.repo.save(item);
  }

  async toggleActivo(id: number): Promise<ProveedorProducto> {
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