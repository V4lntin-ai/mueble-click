import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipio } from './entities/municipio.entity';
import { CreateMunicipioInput } from './dto/create-municipio.input';
import { UpdateMunicipioInput } from './dto/update-municipio.input';
import { EstadosService } from '../estados/estados.service';

@Injectable()
export class MunicipiosService {
  constructor(
    @InjectRepository(Municipio)
    private readonly municipioRepository: Repository<Municipio>,
    private readonly estadosService: EstadosService,
  ) {}

  async findAll(): Promise<Municipio[]> {
    return this.municipioRepository.find();
  }

  async findByEstado(id_estado: number): Promise<Municipio[]> {
    return this.municipioRepository.find({
      where: { estado: { id_estado } },
    });
  }

  async findOne(id_municipio: number): Promise<Municipio> {
    const municipio = await this.municipioRepository.findOneBy({ id_municipio });
    if (!municipio)
      throw new NotFoundException(`Municipio #${id_municipio} no encontrado`);
    return municipio;
  }

  async create(input: CreateMunicipioInput): Promise<Municipio> {
    const estado = await this.estadosService.findOne(input.id_estado);
    const municipio = this.municipioRepository.create({
      nombre: input.nombre,
      estado,
    });
    return this.municipioRepository.save(municipio);
  }

  async update(input: UpdateMunicipioInput): Promise<Municipio> {
    const municipio = await this.findOne(input.id_municipio);
    if (input.id_estado) {
      municipio.estado = await this.estadosService.findOne(input.id_estado);
    }
    if (input.nombre) municipio.nombre = input.nombre;
    return this.municipioRepository.save(municipio);
  }

  async remove(id_municipio: number): Promise<boolean> {
    const municipio = await this.findOne(id_municipio);
    await this.municipioRepository.remove(municipio);
    return true;
  }
}