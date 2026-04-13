import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreatePedidoInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_direccion?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tipo_entrega?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_sucursal_origen?: number;
}