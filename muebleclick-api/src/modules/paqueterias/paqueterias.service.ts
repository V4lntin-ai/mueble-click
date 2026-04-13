import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paqueteria } from './entities/paqueterias.entity';
import { CreatePaqueteriaInput } from './dto/create-paqueterias.input';
import { UpdatePaqueteriaInput } from './dto/update-paqueterias.input';

@Injectable()
export class PaqueteriasService {
  constructor(
    @InjectRepository(Paqueteria)
    private readonly repo: Repository<Paqueteria>,
  ) {}

  async findAll(): Promise<Paqueteria[]> {
    return this.repo.find();
  }

  async findOne(id_paqueteria: number): Promise<Paqueteria> {
    const paqueteria = await this.repo.findOneBy({ id_paqueteria });
    if (!paqueteria)
      throw new NotFoundException(
        `Paquetería #${id_paqueteria} no encontrada`,
      );
    return paqueteria;
  }

  async create(input: CreatePaqueteriaInput): Promise<Paqueteria> {
    const paqueteria = this.repo.create(input);
    return this.repo.save(paqueteria);
  }

  async update(input: UpdatePaqueteriaInput): Promise<Paqueteria> {
    const paqueteria = await this.findOne(input.id_paqueteria);
    Object.assign(paqueteria, input);
    return this.repo.save(paqueteria);
  }
}