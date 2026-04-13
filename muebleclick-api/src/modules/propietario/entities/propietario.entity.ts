import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
@Entity('propietario')
export class Propietario {
  @Field(() => Int)
  @PrimaryColumn()
  id_usuario!: number;

  @Field(() => Usuario)
  @OneToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  curp_rfc!: string;

  @Field({ nullable: true })
  @Column({ length: 18, nullable: true })
  clabe_interbancaria!: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  banco!: string;

  @Field()
  @Column({ default: false })
  verificado!: boolean;
}