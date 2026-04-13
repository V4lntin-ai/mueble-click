import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedores.entity';
import { CreateProveedorInput } from './dto/create-proveedores.input';
import { UpdateProveedorInput } from './dto/update-proveedores.input';
import { MunicipiosService } from '../municipios/municipios.service';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    private readonly municipiosService: MunicipiosService,
  ) {}

  async findAll(): Promise<Proveedor[]> {
    return this.proveedorRepository.find();
  }

  async findOne(id_proveedor: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOneBy({ id_proveedor });
    if (!proveedor)
      throw new NotFoundException(`Proveedor #${id_proveedor} no encontrado`);
    return proveedor;
  }

  async findByTipo(tipo_proveedor: string): Promise<Proveedor[]> {
    return this.proveedorRepository.findBy({ tipo_proveedor });
  }

  async create(input: CreateProveedorInput): Promise<Proveedor> {
    const proveedor = this.proveedorRepository.create(input);

    if (input.id_municipio) {
      proveedor.municipio = await this.municipiosService.findOne(
        input.id_municipio,
      );
    }

    return this.proveedorRepository.save(proveedor);
  }

  async update(input: UpdateProveedorInput): Promise<Proveedor> {
    const proveedor = await this.findOne(input.id_proveedor);

    if (input.id_municipio) {
      proveedor.municipio = await this.municipiosService.findOne(
        input.id_municipio,
      );
    }

    Object.assign(proveedor, input);
    return this.proveedorRepository.save(proveedor);
  }

  async remove(id_proveedor: number): Promise<boolean> {
    const proveedor = await this.findOne(id_proveedor);
    await this.proveedorRepository.remove(proveedor);
    return true;
  }
}