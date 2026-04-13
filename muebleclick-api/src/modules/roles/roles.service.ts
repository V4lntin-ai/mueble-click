import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolInput } from './dto/create-rol.input';
import { UpdateRolInput } from './dto/update-rol.input';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async findOne(id_rol: number): Promise<Rol> {
    const rol = await this.rolRepository.findOneBy({ id_rol });
    if (!rol) throw new NotFoundException(`Rol #${id_rol} no encontrado`);
    return rol;
  }

  async findByNombre(nombre: string): Promise<Rol> {
    const rol = await this.rolRepository.findOneBy({ nombre });
    if (!rol) throw new NotFoundException(`Rol "${nombre}" no encontrado`);
    return rol;
  }

  async create(input: CreateRolInput): Promise<Rol> {
    const existe = await this.rolRepository.findOneBy({ nombre: input.nombre });
    if (existe) throw new ConflictException(`El rol "${input.nombre}" ya existe`);

    const rol = this.rolRepository.create(input);
    return this.rolRepository.save(rol);
  }

  async update(input: UpdateRolInput): Promise<Rol> {
    const rol = await this.findOne(input.id_rol);
    Object.assign(rol, input);
    return this.rolRepository.save(rol);
  }

  async remove(id_rol: number): Promise<boolean> {
    const rol = await this.findOne(id_rol);
    await this.rolRepository.remove(rol);
    return true;
  }
}