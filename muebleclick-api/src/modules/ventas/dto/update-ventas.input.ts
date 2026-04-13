import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class UpdateVentaInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_venta!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  estado_venta!: string;
}