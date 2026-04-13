import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsPositive,
} from 'class-validator';

@InputType()
export class CreateTransferenciaInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_sucursal_origen!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_sucursal_destino!: number;
}