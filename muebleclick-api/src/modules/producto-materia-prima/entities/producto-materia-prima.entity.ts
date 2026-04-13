import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/productos.entity';
import { MateriaPrima } from '../../materias-primas/entities/materias-primas.entity';

@ObjectType()
@Entity('producto_materia_prima')
export class ProductoMateriaPrima {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Producto)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;

  @Field(() => MateriaPrima)
  @ManyToOne(() => MateriaPrima, { eager: true })
  @JoinColumn({ name: 'id_materia' })
  materia_prima!: MateriaPrima;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidad_por_unidad!: number;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  unidad!: string;
}