import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Municipio } from '../../municipios/entities/municipio.entity';

@ObjectType()
@Entity('proveedores')
export class Proveedor {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_proveedor!: number;

  @Field()
  @Column({ length: 150 })
  nombre!: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  contacto_nombre!: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  contacto_email!: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  telefono!: string;

  @Field(() => Municipio, { nullable: true })
  @ManyToOne(() => Municipio, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_municipio' })
  municipio!: Municipio;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  direccion!: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  rfc!: string;

  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  cuenta_bancaria!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  tiempo_entrega_dias!: number;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  tipo_proveedor!: string; // materia_prima | producto | servicio
}