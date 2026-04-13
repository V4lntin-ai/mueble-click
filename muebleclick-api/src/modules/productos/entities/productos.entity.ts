import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Muebleria } from '../../mueblerias/entities/mueblerias.entity';

@ObjectType()
@Entity('productos')
export class Producto {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_producto!: number;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true, unique: true })
  sku!: string;

  @Field(() => Muebleria)
  @ManyToOne(() => Muebleria, { eager: true })
  @JoinColumn({ name: 'id_muebleria' })
  muebleria!: Muebleria;

  @Field()
  @Column({ length: 150 })
  nombre!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  categoria!: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  unidad_medida!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  imagen_url!: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio_venta!: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  peso_kg!: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  volumen_m3!: number;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  tipo_producto!: string; // materia_prima | ensamblado | producto_final

  @Field()
  @CreateDateColumn()
  creado_en!: Date;

  @Field()
  @UpdateDateColumn()
  actualizado_en!: Date;
}