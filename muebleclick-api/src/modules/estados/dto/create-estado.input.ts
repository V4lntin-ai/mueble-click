import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateEstadoInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  codigo_iso!: string;
}