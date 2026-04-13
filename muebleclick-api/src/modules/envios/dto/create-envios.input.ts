import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CreateEnvioInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_venta!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_paqueteria!: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id_direccion!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fecha_entrega_estimada?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tracking_number?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costo_envio?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  seguro?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nota?: string;
}