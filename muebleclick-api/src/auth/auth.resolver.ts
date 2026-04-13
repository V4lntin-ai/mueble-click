import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.type';
import { LoginInput } from './dto/login.input';
import { CreateUsuarioInput } from '../modules/usuarios/dto/create-usuario.input';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Mutation(() => AuthResponse)
  register(@Args('input') input: CreateUsuarioInput): Promise<AuthResponse> {
    return this.authService.register(input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Usuario)
  me(@CurrentUser() usuario: Usuario): Usuario {
    return usuario;
  }
}