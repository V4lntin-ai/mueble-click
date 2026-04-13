import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Estado } from '../../estados/entities/estado.entity';

@ObjectType()
@Entity('municipios')
export class Municipio {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_municipio!: number;

  @Field()
  @Column({ length: 150 })
  nombre!: string;

  @Field(() => Estado)
  @ManyToOne(() => Estado, (estado) => estado.municipios, { eager: true })
  @JoinColumn({ name: 'id_estado' })
  estado!: Estado;
}