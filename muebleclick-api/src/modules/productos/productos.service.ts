import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Producto } from './entities/productos.entity';
import { CreateProductoInput } from './dto/create-productos.input';
import { UpdateProductoInput } from './dto/update-productos.input';
import { MuebleriaService } from '../mueblerias/mueblerias.service';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly muebleriaService: MuebleriaService,
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id_producto: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id_producto });
    if (!producto)
      throw new NotFoundException(`Producto #${id_producto} no encontrado`);
    return producto;
  }

  async findByMuebleria(id_muebleria: number): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { muebleria: { id_muebleria } },
    });
  }

  async findByCategoria(categoria: string): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { categoria: ILike(`%${categoria}%`) },
    });
  }

  async search(termino: string): Promise<Producto[]> {
    return this.productoRepository.find({
      where: [
        { nombre: ILike(`%${termino}%`) },
        { descripcion: ILike(`%${termino}%`) },
        { sku: ILike(`%${termino}%`) },
      ],
    });
  }

  async create(
    input: CreateProductoInput,
    id_usuario_solicitante: number,
  ): Promise<Producto> {
    const muebleria = await this.muebleriaService.findOne(input.id_muebleria);

    if (muebleria.propietario.id_usuario !== id_usuario_solicitante) {
      throw new ForbiddenException(
        'Solo el propietario puede agregar productos a su mueblería',
      );
    }

    const producto = this.productoRepository.create({
      ...input,
      muebleria,
    });

    return this.productoRepository.save(producto);
  }

  async update(
    input: UpdateProductoInput,
    id_usuario_solicitante: number,
  ): Promise<Producto> {
    const producto = await this.findOne(input.id_producto);

    if (
      producto.muebleria.propietario.id_usuario !== id_usuario_solicitante
    ) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este producto',
      );
    }

    Object.assign(producto, input);
    return this.productoRepository.save(producto);
  }

  async remove(
    id_producto: number,
    id_usuario_solicitante: number,
  ): Promise<boolean> {
    const producto = await this.findOne(id_producto);

    if (
      producto.muebleria.propietario.id_usuario !== id_usuario_solicitante
    ) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este producto',
      );
    }

    await this.productoRepository.remove(producto);
    return true;
  }
}