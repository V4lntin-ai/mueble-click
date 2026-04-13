import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Propietario } from '../../propietario/entities/propietario.entity';
  import { Sucursal } from '../../sucursales/entities/sucursales.entity';

@ObjectType()
@Entity('mueblerias')
export class Muebleria {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_muebleria!: number;

  @Field()
  @Column({ length: 150 })
  nombre_negocio!: string;

  @Field(() => Propietario)
  @ManyToOne(() => Propietario, { eager: true })
  @JoinColumn({ name: 'id_propietario' })
  propietario!: Propietario;

  @Field({ nullable: true })
  @Column({ length: 150, nullable: true })
  razon_social!: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  rfc!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  direccion_principal!: string;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  telefono!: string;

  @Field()
  @CreateDateColumn()
  creado_en!: Date;

  @Field(() => [Sucursal], { nullable: true })
  @OneToMany(() => Sucursal, (sucursal) => sucursal.muebleria)
  sucursales!: Sucursal[];
}