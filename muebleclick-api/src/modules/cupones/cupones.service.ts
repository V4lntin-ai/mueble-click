import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cupon } from './entities/cupones.entity';
import { CreateCuponInput } from './dto/create-cupones.input';
import { UpdateCuponInput } from './dto/update-cupones.input';

@Injectable()
export class CuponesService {
  constructor(
    @InjectRepository(Cupon)
    private readonly repo: Repository<Cupon>,
  ) {}

  async findAll(): Promise<Cupon[]> {
    return this.repo.find();
  }

  async findOne(id_cupon: number): Promise<Cupon> {
    const cupon = await this.repo.findOneBy({ id_cupon });
    if (!cupon)
      throw new NotFoundException(`Cupón #${id_cupon} no encontrado`);
    return cupon;
  }

  async findByCodigo(codigo: string): Promise<Cupon> {
    const cupon = await this.repo.findOneBy({ codigo });
    if (!cupon)
      throw new NotFoundException(`Cupón "${codigo}" no encontrado`);
    return cupon;
  }

  async validar(codigo: string): Promise<Cupon> {
    const cupon = await this.findByCodigo(codigo);

    if (!cupon.activo)
      throw new BadRequestException(`El cupón "${codigo}" no está activo`);

    const hoy = new Date();
    const expiracion = new Date(cupon.fecha_expiracion);
    if (hoy > expiracion)
      throw new BadRequestException(`El cupón "${codigo}" ha expirado`);

    return cupon;
  }

  async create(input: CreateCuponInput): Promise<Cupon> {
    const cupon = this.repo.create({ ...input, activo: input.activo ?? true });
    return this.repo.save(cupon);
  }

  async update(input: UpdateCuponInput): Promise<Cupon> {
    const cupon = await this.findOne(input.id_cupon);
    Object.assign(cupon, input);
    return this.repo.save(cupon);
  }

  async toggleActivo(id_cupon: number): Promise<Cupon> {
    const cupon = await this.findOne(id_cupon);
    cupon.activo = !cupon.activo;
    return this.repo.save(cupon);
  }
}