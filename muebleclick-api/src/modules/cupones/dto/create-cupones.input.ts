import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateCuponInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  codigo!: string;

  @Field(() => Float)
  @IsNumber()
  @Min(1)
  @Max(100)
  descuento_porcentaje!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  fecha_expiracion!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}