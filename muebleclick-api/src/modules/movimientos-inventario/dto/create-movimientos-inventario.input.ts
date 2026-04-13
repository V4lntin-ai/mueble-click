import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateMovimientoInventarioInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_sucursal!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_producto!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  tipo!: string; // entrada | salida | ajuste

  @Field(() => Int)
  @IsInt()
  @Min(1)
  cantidad!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  referencia_tipo?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  referencia_id?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nota?: string;
}