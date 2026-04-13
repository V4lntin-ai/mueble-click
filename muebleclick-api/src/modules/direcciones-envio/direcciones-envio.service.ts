import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DireccionEnvio } from './entities/direcciones-envio.entity';
import { CreateDireccionEnvioInput } from './dto/create-direcciones-envio.input';
import { UpdateDireccionEnvioInput } from './dto/update-direcciones-envio.input';
import { ClienteService } from '../cliente/cliente.service';
import { MunicipiosService } from '../municipios/municipios.service';

@Injectable()
export class DireccionesEnvioService {
  constructor(
    @InjectRepository(DireccionEnvio)
    private readonly repo: Repository<DireccionEnvio>,
    private readonly clienteService: ClienteService,
    private readonly municipiosService: MunicipiosService,
  ) {}

  async findOne(id_direccion: number): Promise<DireccionEnvio> {
    const dir = await this.repo.findOneBy({ id_direccion });
    if (!dir)
      throw new NotFoundException(`Dirección #${id_direccion} no encontrada`);
    return dir;
  }

  async findByCliente(id_cliente: number): Promise<DireccionEnvio[]> {
    return this.repo.find({
      where: { cliente: { id_usuario: id_cliente } },
    });
  }

  async create(
    input: CreateDireccionEnvioInput,
    id_usuario: number,
  ): Promise<DireccionEnvio> {
    const cliente = await this.clienteService.findOne(id_usuario);

    const dir = this.repo.create({
      cliente,
      calle_numero: input.calle_numero,
      referencias: input.referencias,
    });

    if (input.id_municipio) {
      dir.municipio = await this.municipiosService.findOne(input.id_municipio);
    }

    return this.repo.save(dir);
  }

  async update(
    input: UpdateDireccionEnvioInput,
    id_usuario: number,
  ): Promise<DireccionEnvio> {
    const dir = await this.findOne(input.id_direccion);

    if (dir.cliente.id_usuario !== id_usuario)
      throw new ForbiddenException(
        'No tienes permiso para modificar esta dirección',
      );

    if (input.id_municipio) {
      dir.municipio = await this.municipiosService.findOne(input.id_municipio);
    }

    Object.assign(dir, input);
    return this.repo.save(dir);
  }

  async remove(id_direccion: number, id_usuario: number): Promise<boolean> {
    const dir = await this.findOne(id_direccion);

    if (dir.cliente.id_usuario !== id_usuario)
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta dirección',
      );

    await this.repo.remove(dir);
    return true;
  }
}