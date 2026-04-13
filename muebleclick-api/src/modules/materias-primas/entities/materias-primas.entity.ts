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
import { Proveedor } from '../../proveedores/entities/proveedores.entity';

@ObjectType()
@Entity('materias_primas')
export class MateriaPrima {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_materia!: number;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true, unique: true })
  codigo!: string;

  @Field()
  @Column({ length: 150 })
  nombre!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  unidad_medida!: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio_unitario!: number;

  @Field(() => Proveedor, { nullable: true })
  @ManyToOne(() => Proveedor, { eager: true, nullable: true })
  @JoinColumn({ name: 'proveedor_preferente' })
  proveedor_preferente!: Proveedor;

  @Field()
  @CreateDateColumn()
  creado_en!: Date;

  @Field()
  @UpdateDateColumn()
  actualizado_en!: Date;
}