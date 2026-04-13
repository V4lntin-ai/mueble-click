import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

@InputType()
export class CreateDetalleOrdenCompraInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_orden!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_producto?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_materia?: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0.001)
  cantidad!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  precio_unitario!: number;
}