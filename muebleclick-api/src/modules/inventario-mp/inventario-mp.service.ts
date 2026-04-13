import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioMP } from './entities/inventario-mp.entity';
import { CreateInventarioMPInput } from './dto/create-inventario-mp.input';
import { UpdateInventarioMPInput } from './dto/update-inventario-mp.input';
import { SucursalesService } from '../sucursales/sucursales.service';
import { MateriasPrimasService } from '../materias-primas/materias-primas.service';

@Injectable()
export class InventarioMPService {
  constructor(
    @InjectRepository(InventarioMP)
    private readonly inventarioMPRepository: Repository<InventarioMP>,
    private readonly sucursalesService: SucursalesService,
    private readonly materiasPrimasService: MateriasPrimasService,
  ) {}

  async findAll(): Promise<InventarioMP[]> {
    return this.inventarioMPRepository.find();
  }

  async findOne(id_inventario_mp: number): Promise<InventarioMP> {
    const inv = await this.inventarioMPRepository.findOneBy({
      id_inventario_mp,
    });
    if (!inv)
      throw new NotFoundException(
        `InventarioMP #${id_inventario_mp} no encontrado`,
      );
    return inv;
  }

  async findBySucursal(id_sucursal: number): Promise<InventarioMP[]> {
    return this.inventarioMPRepository.find({
      where: { sucursal: { id_sucursal } },
    });
  }

  async findBySucursalYMateria(
    id_sucursal: number,
    id_materia: number,
  ): Promise<InventarioMP | null> {
    return this.inventarioMPRepository.findOne({
      where: {
        sucursal: { id_sucursal },
        materia_prima: { id_materia },
      },
    });
  }

  async findStockCritico(id_sucursal: number): Promise<InventarioMP[]> {
    return this.inventarioMPRepository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.sucursal', 'sucursal')
      .leftJoinAndSelect('inv.materia_prima', 'materia_prima')
      .where('sucursal.id_sucursal = :id_sucursal', { id_sucursal })
      .andWhere('inv.cantidad <= inv.stock_min')
      .getMany();
  }

  async create(input: CreateInventarioMPInput): Promise<InventarioMP> {
    const sucursal = await this.sucursalesService.findOne(input.id_sucursal);
    const materia_prima = await this.materiasPrimasService.findOne(
      input.id_materia,
    );

    const existe = await this.findBySucursalYMateria(
      input.id_sucursal,
      input.id_materia,
    );
    if (existe)
      throw new ConflictException(
        `Ya existe inventario para la materia prima #${input.id_materia} en la sucursal #${input.id_sucursal}`,
      );

    const inventario = this.inventarioMPRepository.create({
      sucursal,
      materia_prima,
      cantidad: input.cantidad ?? 0,
      stock_min: input.stock_min ?? 0,
      stock_max: input.stock_max ?? 0,
    });

    return this.inventarioMPRepository.save(inventario);
  }

  async update(input: UpdateInventarioMPInput): Promise<InventarioMP> {
    const inventario = await this.findOne(input.id_inventario_mp);
    Object.assign(inventario, input);
    return this.inventarioMPRepository.save(inventario);
  }

  async ajustarCantidad(
    id_inventario_mp: number,
    delta: number,
  ): Promise<InventarioMP> {
    const inventario = await this.findOne(id_inventario_mp);
    const nueva_cantidad = Number(inventario.cantidad) + delta;

    if (nueva_cantidad < 0)
      throw new BadRequestException(
        `Stock de materia prima insuficiente. Disponible: ${inventario.cantidad}`,
      );

    inventario.cantidad = nueva_cantidad;
    return this.inventarioMPRepository.save(inventario);
  }
}