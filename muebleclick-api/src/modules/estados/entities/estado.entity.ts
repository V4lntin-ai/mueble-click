import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Municipio } from '../../municipios/entities/municipio.entity';

@ObjectType()
@Entity('estados')
export class Estado {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_estado!: number;

  @Field()
  @Column({ length: 100 })
  nombre!: string;

  @Field()
  @Column({ length: 10 })
  codigo_iso!: string;

  @Field(() => [Municipio], { nullable: true })
  @OneToMany(() => Municipio, (municipio) => municipio.estado)
  municipios!: Municipio[];
}