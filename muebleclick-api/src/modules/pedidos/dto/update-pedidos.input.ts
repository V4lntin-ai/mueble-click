import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class UpdatePedidoInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_pedido!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  estado_pedido!: string;
}