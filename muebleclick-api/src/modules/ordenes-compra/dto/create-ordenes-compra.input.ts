import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreateOrdenCompraInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_proveedor!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_sucursal!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fecha_recepcion_esperada?: string;
}