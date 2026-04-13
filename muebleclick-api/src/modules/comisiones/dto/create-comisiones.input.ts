import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

@InputType()
export class CreateComisionInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_venta!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_vendedor!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  porcentaje!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  monto!: number;
}