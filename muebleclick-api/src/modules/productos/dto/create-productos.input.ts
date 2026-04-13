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
export class CreateProductoInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sku?: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_muebleria!: number;

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
  @MaxLength(50)
  categoria?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unidad_medida?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imagen_url?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  precio_venta!: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  peso_kg?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  volumen_m3?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  tipo_producto?: string;
}