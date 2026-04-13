import { InputType, Field } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreatePaqueteriaInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  url_tracking?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  tiempo_promedio_entrega_days?: number;
}