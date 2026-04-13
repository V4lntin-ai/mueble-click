import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Propietario } from './entities/propietario.entity';
import { CreatePropietarioInput } from './dto/create-propietario.input';
import { UpdatePropietarioInput } from './dto/update-propietario.input';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class PropietarioService {
  constructor(
    @InjectRepository(Propietario)
    private readonly propietarioRepository: Repository<Propietario>,
    private readonly usuariosService: UsuariosService,
  ) {}

  async findAll(): Promise<Propietario[]> {
    return this.propietarioRepository.find();
  }

  async findOne(id_usuario: number): Promise<Propietario> {
    const propietario = await this.propietarioRepository.findOneBy({
      id_usuario,
    });
    if (!propietario)
      throw new NotFoundException(
        `Propietario con id_usuario #${id_usuario} no encontrado`,
      );
    return propietario;
  }

  async create(input: CreatePropietarioInput): Promise<Propietario> {
    const usuario = await this.usuariosService.findOne(input.id_usuario);

    const existe = await this.propietarioRepository.findOneBy({
      id_usuario: input.id_usuario,
    });
    if (existe)
      throw new ConflictException(
        `El usuario #${input.id_usuario} ya tiene perfil de propietario`,
      );

    const propietario = this.propietarioRepository.create({
      id_usuario: usuario.id_usuario,
      usuario,
      curp_rfc: input.curp_rfc,
      clabe_interbancaria: input.clabe_interbancaria,
      banco: input.banco,
    });

    return this.propietarioRepository.save(propietario);
  }

  async update(input: UpdatePropietarioInput): Promise<Propietario> {
    const propietario = await this.findOne(input.id_usuario);
    Object.assign(propietario, input);
    return this.propietarioRepository.save(propietario);
  }

  async verificar(id_usuario: number): Promise<Propietario> {
    const propietario = await this.findOne(id_usuario);
    propietario.verificado = true;
    return this.propietarioRepository.save(propietario);
  }
}