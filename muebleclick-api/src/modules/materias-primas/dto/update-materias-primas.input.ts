import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateMateriaPrimaInput } from './create-materias-primas.input';

@InputType()
export class UpdateMateriaPrimaInput extends PartialType(CreateMateriaPrimaInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_materia!: number;
}