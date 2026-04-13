import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { CreateMunicipioInput } from './create-municipio.input';

@InputType()
export class UpdateMunicipioInput extends PartialType(CreateMunicipioInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_municipio!: number;
}