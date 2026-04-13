import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateMateriaPrimaInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unidad_medida?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  precio_unitario!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_proveedor_preferente?: number;
}