import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';
import { CreateMetodoPagoInput } from './dto/create-metodo-pago.input';
import { UpdateMetodoPagoInput } from './dto/update-metodo-pago.input';

@Injectable()
export class MetodoPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly repo: Repository<MetodoPago>,
  ) {}

  async findAll(): Promise<MetodoPago[]> {
    return this.repo.find();
  }

  async findOne(id_metodo: number): Promise<MetodoPago> {
    const metodo = await this.repo.findOneBy({ id_metodo });
    if (!metodo)
      throw new NotFoundException(`Método de pago #${id_metodo} no encontrado`);
    return metodo;
  }

  async create(input: CreateMetodoPagoInput): Promise<MetodoPago> {
    const metodo = this.repo.create(input);
    return this.repo.save(metodo);
  }

  async update(input: UpdateMetodoPagoInput): Promise<MetodoPago> {
    const metodo = await this.findOne(input.id_metodo);
    Object.assign(metodo, input);
    return this.repo.save(metodo);
  }
}