import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreateVentaInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_pedido?: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_metodo_pago!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  codigo_cupon?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_vendedor?: number;
}