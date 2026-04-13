import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompraProveedor } from './entities/compras-proveedores.entity';
import { CreateCompraProveedorInput } from './dto/create-compras-proveedores.input';
import { UpdateCompraProveedorInput } from './dto/update-compras-proveedores.input';
import { ProveedoresService } from '../proveedores/proveedores.service';

@Injectable()
export class ComprasProveedoresService {
  constructor(
    @InjectRepository(CompraProveedor)
    private readonly repo: Repository<CompraProveedor>,
    private readonly proveedoresService: ProveedoresService,
  ) {}

  async findAll(): Promise<CompraProveedor[]> {
    return this.repo.find({ order: { fecha_compra: 'DESC' } });
  }

  async findOne(id_compra: number): Promise<CompraProveedor> {
    const compra = await this.repo.findOneBy({ id_compra });
    if (!compra)
      throw new NotFoundException(`Compra #${id_compra} no encontrada`);
    return compra;
  }

  async findByProveedor(id_proveedor: number): Promise<CompraProveedor[]> {
    return this.repo.find({
      where: { proveedor: { id_proveedor } },
      order: { fecha_compra: 'DESC' },
    });
  }

  async create(input: CreateCompraProveedorInput): Promise<CompraProveedor> {
    const proveedor = await this.proveedoresService.findOne(input.id_proveedor);
    const compra = this.repo.create({ ...input, proveedor });
    return this.repo.save(compra);
  }

  async update(input: UpdateCompraProveedorInput): Promise<CompraProveedor> {
    const compra = await this.findOne(input.id_compra);
    Object.assign(compra, input);
    return this.repo.save(compra);
  }
}