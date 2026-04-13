import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateMunicipioInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre!: string;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_estado!: number;
}