import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Municipio } from '../../municipios/entities/municipio.entity';

@ObjectType()
@Entity('cliente')
export class Cliente {
  @Field(() => Int)
  @PrimaryColumn()
  id_usuario!: number;

  @Field(() => Usuario)
  @OneToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  telefono!: string;

  @Field(() => Municipio, { nullable: true })
  @ManyToOne(() => Municipio, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_municipio_default' })
  municipio_default!: Municipio;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  direccion_principal!: string;

  @Field(() => Int)
  @Column({ default: 0 })
  puntos!: number;
}