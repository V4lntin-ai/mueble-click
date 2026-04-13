import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Municipio } from '../../municipios/entities/municipio.entity';

@ObjectType()
@Entity('direcciones_envio')
export class DireccionEnvio {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_direccion!: number;

  @Field(() => Cliente)
  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;

  @Field()
  @Column({ type: 'text' })
  calle_numero!: string;

  @Field(() => Municipio, { nullable: true })
  @ManyToOne(() => Municipio, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_municipio' })
  municipio!: Municipio;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  referencias!: string;
}