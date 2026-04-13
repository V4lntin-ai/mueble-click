import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MateriaPrima } from './entities/materias-primas.entity';
import { CreateMateriaPrimaInput } from './dto/create-materias-primas.input';
import { UpdateMateriaPrimaInput } from './dto/update-materias-primas.input';
import { ProveedoresService } from '../proveedores/proveedores.service';

@Injectable()
export class MateriasPrimasService {
  constructor(
    @InjectRepository(MateriaPrima)
    private readonly materiaPrimaRepository: Repository<MateriaPrima>,
    private readonly proveedoresService: ProveedoresService,
  ) {}

  async findAll(): Promise<MateriaPrima[]> {
    return this.materiaPrimaRepository.find();
  }

  async findOne(id_materia: number): Promise<MateriaPrima> {
    const materia = await this.materiaPrimaRepository.findOneBy({ id_materia });
    if (!materia)
      throw new NotFoundException(`Materia prima #${id_materia} no encontrada`);
    return materia;
  }

  async search(termino: string): Promise<MateriaPrima[]> {
    return this.materiaPrimaRepository.find({
      where: [
        { nombre: ILike(`%${termino}%`) },
        { codigo: ILike(`%${termino}%`) },
      ],
    });
  }

  async create(input: CreateMateriaPrimaInput): Promise<MateriaPrima> {
    const materia = this.materiaPrimaRepository.create({
      codigo: input.codigo,
      nombre: input.nombre,
      descripcion: input.descripcion,
      unidad_medida: input.unidad_medida,
      precio_unitario: input.precio_unitario,
    });

    if (input.id_proveedor_preferente) {
      materia.proveedor_preferente = await this.proveedoresService.findOne(
        input.id_proveedor_preferente,
      );
    }

    return this.materiaPrimaRepository.save(materia);
  }

  async update(input: UpdateMateriaPrimaInput): Promise<MateriaPrima> {
    const materia = await this.findOne(input.id_materia);

    if (input.id_proveedor_preferente) {
      materia.proveedor_preferente = await this.proveedoresService.findOne(
        input.id_proveedor_preferente,
      );
    }

    Object.assign(materia, input);
    return this.materiaPrimaRepository.save(materia);
  }

  async remove(id_materia: number): Promise<boolean> {
    const materia = await this.findOne(id_materia);
    await this.materiaPrimaRepository.remove(materia);
    return true;
  }
}