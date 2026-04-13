import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly rolesService: RolesService,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id_usuario: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id_usuario });
    if (!usuario)
      throw new NotFoundException(`Usuario #${id_usuario} no encontrado`);
    return usuario;
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ correo });
  }

  async create(input: CreateUsuarioInput): Promise<Usuario> {
    const existe = await this.usuarioRepository.findOneBy({
      correo: input.correo,
    });
    if (existe)
      throw new ConflictException(`El correo "${input.correo}" ya está registrado`);

    const rol = await this.rolesService.findOne(input.role_id);

    const hash = await bcrypt.hash(input.password, 10);

    const usuario = this.usuarioRepository.create({
      nombre: input.nombre,
      correo: input.correo,
      password: hash,
      rol,
    });

    return this.usuarioRepository.save(usuario);
  }

  async update(input: UpdateUsuarioInput): Promise<Usuario> {
    const usuario = await this.findOne(input.id_usuario);

    if (input.password) {
      input.password = await bcrypt.hash(input.password, 10);
    }

    if (input.role_id) {
      usuario.rol = await this.rolesService.findOne(input.role_id);
    }

    Object.assign(usuario, input);
    return this.usuarioRepository.save(usuario);
  }

  async deactivate(id_usuario: number): Promise<Usuario> {
    const usuario = await this.findOne(id_usuario);
    usuario.activo = false;
    return this.usuarioRepository.save(usuario);
  }

  async validatePassword(usuario: Usuario, password: string): Promise<boolean> {
    return bcrypt.compare(password, usuario.password);
  }
}