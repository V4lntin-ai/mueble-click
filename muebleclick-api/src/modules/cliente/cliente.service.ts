import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteInput } from './dto/create-cliente.input';
import { UpdateClienteInput } from './dto/update-cliente.input';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MunicipiosService } from '../municipios/municipios.service';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly usuariosService: UsuariosService,
    private readonly municipiosService: MunicipiosService,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async findOne(id_usuario: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ id_usuario });
    if (!cliente)
      throw new NotFoundException(
        `Cliente con id_usuario #${id_usuario} no encontrado`,
      );
    return cliente;
  }

  async create(input: CreateClienteInput): Promise<Cliente> {
    const usuario = await this.usuariosService.findOne(input.id_usuario);

    const existe = await this.clienteRepository.findOneBy({
      id_usuario: input.id_usuario,
    });
    if (existe)
      throw new ConflictException(
        `El usuario #${input.id_usuario} ya tiene perfil de cliente`,
      );

    const cliente = this.clienteRepository.create({
      id_usuario: usuario.id_usuario,
      usuario,
      telefono: input.telefono,
      direccion_principal: input.direccion_principal,
    });

    if (input.id_municipio_default) {
      cliente.municipio_default = await this.municipiosService.findOne(
        input.id_municipio_default,
      );
    }

    return this.clienteRepository.save(cliente);
  }

  async update(input: UpdateClienteInput): Promise<Cliente> {
    const cliente = await this.findOne(input.id_usuario);

    if (input.id_municipio_default) {
      cliente.municipio_default = await this.municipiosService.findOne(
        input.id_municipio_default,
      );
    }

    Object.assign(cliente, input);
    return this.clienteRepository.save(cliente);
  }

  async sumarPuntos(id_usuario: number, puntos: number): Promise<Cliente> {
    const cliente = await this.findOne(id_usuario);
    cliente.puntos += puntos;
    return this.clienteRepository.save(cliente);
  }
}