import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Muebleria } from './entities/mueblerias.entity';
import { CreateMuebleriaInput } from './dto/create-mueblerias.input';
import { UpdateMuebleriaInput } from './dto/update-mueblerias.input';
import { PropietarioService } from '../propietario/propietario.service';

@Injectable()
export class MuebleriaService {
  constructor(
    @InjectRepository(Muebleria)
    private readonly muebleriaRepository: Repository<Muebleria>,
    private readonly propietarioService: PropietarioService,
  ) {}

  async findAll(): Promise<Muebleria[]> {
    return this.muebleriaRepository.find({ relations: ['sucursales'] });
  }

  async findOne(id_muebleria: number): Promise<Muebleria> {
    const muebleria = await this.muebleriaRepository.findOne({
      where: { id_muebleria },
      relations: ['sucursales'],
    });
    if (!muebleria)
      throw new NotFoundException(`Mueblería #${id_muebleria} no encontrada`);
    return muebleria;
  }

  async findByPropietario(id_propietario: number): Promise<Muebleria[]> {
    return this.muebleriaRepository.find({
      where: { propietario: { id_usuario: id_propietario } },
      relations: ['sucursales'],
    });
  }

  async create(
    input: CreateMuebleriaInput,
    id_usuario_solicitante: number,
  ): Promise<Muebleria> {
    const propietario = await this.propietarioService.findOne(
      input.id_propietario,
    );

    // Solo el mismo propietario o un Admin puede crear
    if (
      propietario.id_usuario !== id_usuario_solicitante
    ) {
      throw new ForbiddenException(
        'Solo puedes crear mueblerías asociadas a tu propio perfil',
      );
    }

    const muebleria = this.muebleriaRepository.create({
      ...input,
      propietario,
    });

    return this.muebleriaRepository.save(muebleria);
  }

  async update(
    input: UpdateMuebleriaInput,
    id_usuario_solicitante: number,
  ): Promise<Muebleria> {
    const muebleria = await this.findOne(input.id_muebleria);

    if (
      muebleria.propietario.id_usuario !== id_usuario_solicitante
    ) {
      throw new ForbiddenException(
        'No tienes permiso para modificar esta mueblería',
      );
    }

    Object.assign(muebleria, input);
    return this.muebleriaRepository.save(muebleria);
  }

  async remove(
    id_muebleria: number,
    id_usuario_solicitante: number,
  ): Promise<boolean> {
    const muebleria = await this.findOne(id_muebleria);

    if (
      muebleria.propietario.id_usuario !== id_usuario_solicitante
    ) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta mueblería',
      );
    }

    await this.muebleriaRepository.remove(muebleria);
    return true;
  }
}