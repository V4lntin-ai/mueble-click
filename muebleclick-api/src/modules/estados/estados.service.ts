import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';
import { CreateEstadoInput } from './dto/create-estado.input';
import { UpdateEstadoInput } from './dto/update-estado.input';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async findAll(): Promise<Estado[]> {
    return this.estadoRepository.find({ relations: ['municipios'] });
  }

  async findOne(id_estado: number): Promise<Estado> {
    const estado = await this.estadoRepository.findOne({
      where: { id_estado },
      relations: ['municipios'],
    });
    if (!estado)
      throw new NotFoundException(`Estado #${id_estado} no encontrado`);
    return estado;
  }

  async create(input: CreateEstadoInput): Promise<Estado> {
    const estado = this.estadoRepository.create(input);
    return this.estadoRepository.save(estado);
  }

  async update(input: UpdateEstadoInput): Promise<Estado> {
    const estado = await this.findOne(input.id_estado);
    Object.assign(estado, input);
    return this.estadoRepository.save(estado);
  }

  async remove(id_estado: number): Promise<boolean> {
    const estado = await this.findOne(id_estado);
    await this.estadoRepository.remove(estado);
    return true;
  }
}