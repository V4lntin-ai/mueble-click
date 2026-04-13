import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateMuebleriaInput } from './create-mueblerias.input';

@InputType()
export class UpdateMuebleriaInput extends PartialType(CreateMuebleriaInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_muebleria!: number;
}