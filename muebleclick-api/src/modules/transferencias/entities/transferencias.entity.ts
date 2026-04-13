import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sucursal } from '../../sucursales/entities/sucursales.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
@Entity('transferencias')
export class Transferencia {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_transferencia!: number;

  @Field(() => Sucursal)
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'id_sucursal_origen' })
  sucursal_origen!: Sucursal;

  @Field(() => Sucursal)
  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'id_sucursal_destino' })
  sucursal_destino!: Sucursal;

  @Field()
  @CreateDateColumn()
  fecha_transferencia!: Date;

  @Field()
  @Column({ length: 20, default: 'Pendiente' })
  estado!: string; // Pendiente | En_transito | Completada | Cancelada

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'creado_por' })
  creado_por!: Usuario;
}