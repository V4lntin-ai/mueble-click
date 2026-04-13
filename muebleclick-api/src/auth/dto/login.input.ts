import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  correo!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;
}