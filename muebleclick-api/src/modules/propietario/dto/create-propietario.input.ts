import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreatePropietarioInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_usuario!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  curp_rfc?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(18)
  clabe_interbancaria?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  banco?: string;
}