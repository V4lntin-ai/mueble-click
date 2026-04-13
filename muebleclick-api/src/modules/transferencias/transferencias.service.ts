import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transferencia } from './entities/transferencias.entity';
import { CreateTransferenciaInput } from './dto/create-transferencias.input';
import { UpdateTransferenciaInput } from './dto/update-transferencias.input';
import { SucursalesService } from '../sucursales/sucursales.service';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class TransferenciasService {
  constructor(
    @InjectRepository(Transferencia)
    private readonly repo: Repository<Transferencia>,
    private readonly sucursalesService: SucursalesService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async findAll(): Promise<Transferencia[]> {
    return this.repo.find({ order: { fecha_transferencia: 'DESC' } });
  }

  async findOne(id_transferencia: number): Promise<Transferencia> {
    const transferencia = await this.repo.findOneBy({ id_transferencia });
    if (!transferencia)
      throw new NotFoundException(
        `Transferencia #${id_transferencia} no encontrada`,
      );
    return transferencia;
  }

  async findByOrigen(id_sucursal: number): Promise<Transferencia[]> {
    return this.repo.find({
      where: { sucursal_origen: { id_sucursal } },
      order: { fecha_transferencia: 'DESC' },
    });
  }

  async findByDestino(id_sucursal: number): Promise<Transferencia[]> {
    return this.repo.find({
      where: { sucursal_destino: { id_sucursal } },
      order: { fecha_transferencia: 'DESC' },
    });
  }

  async create(
    input: CreateTransferenciaInput,
    id_usuario: number,
  ): Promise<Transferencia> {
    if (input.id_sucursal_origen === input.id_sucursal_destino)
      throw new BadRequestException(
        'La sucursal origen y destino no pueden ser la misma',
      );

    const sucursal_origen = await this.sucursalesService.findOne(
      input.id_sucursal_origen,
    );
    const sucursal_destino = await this.sucursalesService.findOne(
      input.id_sucursal_destino,
    );
    const creado_por = await this.usuariosService.findOne(id_usuario);

    const transferencia = this.repo.create({
      sucursal_origen,
      sucursal_destino,
      creado_por,
      estado: 'Pendiente',
    });

    return this.repo.save(transferencia);
  }

  async updateEstado(input: UpdateTransferenciaInput): Promise<Transferencia> {
    const transferencia = await this.findOne(input.id_transferencia);

    const estadosValidos = ['En_transito', 'Completada', 'Cancelada'];
    if (!estadosValidos.includes(input.estado))
      throw new BadRequestException(
        `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
      );

    transferencia.estado = input.estado;
    return this.repo.save(transferencia);
  }
}