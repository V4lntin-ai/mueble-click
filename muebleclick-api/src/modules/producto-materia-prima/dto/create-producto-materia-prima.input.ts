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
export class CreateProductoMateriaPrimaInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_producto!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_materia!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  cantidad_por_unidad!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unidad?: string;
}