import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreatePaqueteriaInput } from './create-paqueterias.input';

@InputType()
export class UpdatePaqueteriaInput extends PartialType(CreatePaqueteriaInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_paqueteria!: number;
}