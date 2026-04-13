import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursal } from './entities/sucursales.entity';
import { CreateSucursalInput } from './dto/create-sucursales.input';
import { UpdateSucursalInput } from './dto/update-sucursales.input';
import { MuebleriaService } from '../mueblerias/mueblerias.service';
import { MunicipiosService } from '../municipios/municipios.service';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    private readonly muebleriaService: MuebleriaService,
    private readonly municipiosService: MunicipiosService,
  ) {}

  async findAll(): Promise<Sucursal[]> {
    return this.sucursalRepository.find();
  }

  async findOne(id_sucursal: number): Promise<Sucursal> {
    const sucursal = await this.sucursalRepository.findOneBy({ id_sucursal });
    if (!sucursal)
      throw new NotFoundException(`Sucursal #${id_sucursal} no encontrada`);
    return sucursal;
  }

  async findByMuebleria(id_muebleria: number): Promise<Sucursal[]> {
    return this.sucursalRepository.find({
      where: { muebleria: { id_muebleria } },
    });
  }

  async create(
    input: CreateSucursalInput,
    id_usuario_solicitante: number,
  ): Promise<Sucursal> {
    const muebleria = await this.muebleriaService.findOne(input.id_muebleria);

    if (muebleria.propietario.id_usuario !== id_usuario_solicitante) {
      throw new ForbiddenException(
        'Solo el propietario puede agregar sucursales a su mueblería',
      );
    }

    const sucursal = this.sucursalRepository.create({
      nombre_sucursal: input.nombre_sucursal,
      calle_numero: input.calle_numero,
      telefono: input.telefono,
      activo: input.activo ?? true,
      horario: input.horario ?? undefined,
      muebleria,
    });

    if (input.id_municipio) {
      sucursal.municipio = await this.municipiosService.findOne(
        input.id_municipio,
      );
    }

    return this.sucursalRepository.save(sucursal);
  }

  async update(
    input: UpdateSucursalInput,
    id_usuario_solicitante: number,
  ): Promise<Sucursal> {
    const sucursal = await this.findOne(input.id_sucursal);

    if (
      sucursal.muebleria.propietario.id_usuario !== id_usuario_solicitante
    ) {
      throw new ForbiddenException(
        'No tienes permiso para modificar esta sucursal',
      );
    }

    if (input.id_municipio) {
      sucursal.municipio = await this.municipiosService.findOne(
        input.id_municipio,
      );
    }

    if (input.horario) {
      sucursal.horario = input.horario;
    }

    Object.assign(sucursal, input);
    return this.sucursalRepository.save(sucursal);
  }

  async toggleActivo(
    id_sucursal: number,
    id_usuario_solicitante: number,
  ): Promise<Sucursal> {
    const sucursal = await this.findOne(id_sucursal);

    if (
      sucursal.muebleria.propietario.id_usuario !== id_usuario_solicitante
    ) {
      throw new ForbiddenException(
        'No tienes permiso para modificar esta sucursal',
      );
    }

    sucursal.activo = !sucursal.activo;
    return this.sucursalRepository.save(sucursal);
  }
}