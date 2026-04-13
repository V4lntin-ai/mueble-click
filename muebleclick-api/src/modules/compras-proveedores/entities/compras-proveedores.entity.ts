import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedores.entity';

@ObjectType()
@Entity('compras_proveedores')
export class CompraProveedor {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id_compra!: number;

  @Field(() => Proveedor)
  @ManyToOne(() => Proveedor, { eager: true })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor!: Proveedor;

  @Field()
  @CreateDateColumn()
  fecha_compra!: Date;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total!: number;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  factura_num!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notas!: string;
}