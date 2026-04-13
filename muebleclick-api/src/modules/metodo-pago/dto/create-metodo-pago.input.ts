import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateMetodoPagoInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  tipo_pago!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  detalles_pago?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  estado_pago?: string;
}