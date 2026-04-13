import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class UpdateOrdenCompraInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_orden!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  estado!: string; // Enviada | Recibida | Cancelada
}