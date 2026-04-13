import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateDetalleOrdenProduccionInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_produccion!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_materia!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0.001)
  cantidad_requerida!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unidad?: string;
}