import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreateDireccionEnvioInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  calle_numero!: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_municipio?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  referencias?: string;
}