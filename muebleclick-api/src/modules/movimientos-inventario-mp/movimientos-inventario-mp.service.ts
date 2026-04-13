import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoInventarioMP } from './entities/movimientos-inventario-mp.entity';
import { CreateMovimientoInventarioMPInput } from './dto/create-movimientos-inventario-mp.input';
import { SucursalesService } from '../sucursales/sucursales.service';
import { MateriasPrimasService } from '../materias-primas/materias-primas.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { InventarioMPService } from '../inventario-mp/inventario-mp.service';

@Injectable()
export class MovimientosInventarioMPService {
  constructor(
    @InjectRepository(MovimientoInventarioMP)
    private readonly repo: Repository<MovimientoInventarioMP>,
    private readonly sucursalesService: SucursalesService,
    private readonly materiasPrimasService: MateriasPrimasService,
    private readonly usuariosService: UsuariosService,
    private readonly inventarioMPService: InventarioMPService,
  ) {}

  async findAll(): Promise<MovimientoInventarioMP[]> {
    return this.repo.find();
  }

  async findOne(id_movimiento: number): Promise<MovimientoInventarioMP> {
    const mov = await this.repo.findOneBy({ id_movimiento });
    if (!mov)
      throw new NotFoundException(
        `MovimientoMP #${id_movimiento} no encontrado`,
      );
    return mov;
  }

  async findBySucursal(
    id_sucursal: number,
  ): Promise<MovimientoInventarioMP[]> {
    return this.repo.find({
      where: { sucursal: { id_sucursal } },
      order: { fecha: 'DESC' },
    });
  }

  async findByMateria(id_materia: number): Promise<MovimientoInventarioMP[]> {
    return this.repo.find({
      where: { materia_prima: { id_materia } },
      order: { fecha: 'DESC' },
    });
  }

  async create(
    input: CreateMovimientoInventarioMPInput,
    id_usuario: number,
  ): Promise<MovimientoInventarioMP> {
    const sucursal = await this.sucursalesService.findOne(input.id_sucursal);
    const materia_prima = await this.materiasPrimasService.findOne(
      input.id_materia,
    );
    const usuario = await this.usuariosService.findOne(id_usuario);

    const inventario = await this.inventarioMPService.findBySucursalYMateria(
      input.id_sucursal,
      input.id_materia,
    );

    if (!inventario)
      throw new BadRequestException(
        `No existe inventario para la materia prima #${input.id_materia} en la sucursal #${input.id_sucursal}`,
      );

    const delta =
      input.tipo === 'entrada'
        ? input.cantidad
        : -input.cantidad;

    await this.inventarioMPService.ajustarCantidad(
      inventario.id_inventario_mp,
      delta,
    );

    const movimiento = this.repo.create({
      sucursal,
      materia_prima,
      tipo: input.tipo,
      cantidad: input.cantidad,
      referencia_tipo: input.referencia_tipo,
      referencia_id: input.referencia_id,
      usuario,
      nota: input.nota,
    });

    return this.repo.save(movimiento);
  }
}