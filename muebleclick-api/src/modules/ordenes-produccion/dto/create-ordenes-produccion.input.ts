import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CreateOrdenProduccionInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_producto!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_sucursal!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  cantidad_planificada!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fecha_programada?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notas?: string;
}