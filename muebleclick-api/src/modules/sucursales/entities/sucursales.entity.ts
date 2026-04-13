import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Muebleria } from '../../mueblerias/entities/mueblerias.entity';
import { Municipio } from '../../municipios/entities/municipio.entity';

@ObjectType()
@Entity('sucursales')
export class Sucursal {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_sucursal!: number;

  @Field(() => Muebleria)
  @ManyToOne(() => Muebleria, { eager: true })
  @JoinColumn({ name: 'id_muebleria' })
  muebleria!: Muebleria;

  @Field()
  @Column({ length: 150 })
  nombre_sucursal!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  calle_numero!: string;

  @Field(() => Municipio, { nullable: true })
  @ManyToOne(() => Municipio, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_municipio' })
  municipio!: Municipio;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  telefono!: string;

  @Field({ nullable: true })
  @Column({ type: 'json', nullable: true })
  horario!: string;

  @Field()
  @Column({ default: true })
  activo!: boolean;

  @Field()
  @CreateDateColumn()
  creado_en!: Date;
}