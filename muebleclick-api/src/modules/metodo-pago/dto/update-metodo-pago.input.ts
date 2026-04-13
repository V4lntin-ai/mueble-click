import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateMetodoPagoInput } from './create-metodo-pago.input';

@InputType()
export class UpdateMetodoPagoInput extends PartialType(CreateMetodoPagoInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_metodo!: number;
}