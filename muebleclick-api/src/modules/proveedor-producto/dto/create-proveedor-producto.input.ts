import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateProveedorProductoInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_proveedor!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_producto!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo_proveedor?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  precio_compra!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  lead_time_days?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  min_cantidad_pedido?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}