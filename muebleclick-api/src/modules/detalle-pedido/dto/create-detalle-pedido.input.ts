import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsPositive, Min } from 'class-validator';

@InputType()
export class CreateDetallePedidoInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_pedido!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_producto!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  cantidad!: number;
}