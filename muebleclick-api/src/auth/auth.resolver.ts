import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.type';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { CreateUsuarioInput } from '../modules/usuarios/dto/create-usuario.input';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';

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

  // Renovar access token con refresh token
  @UseGuards(JwtRefreshGuard)
  @Mutation(() => AuthResponse)
  refreshToken(
    @Args('input') input: RefreshTokenInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<AuthResponse> {
    return this.authService.refresh(usuario);
  }

  // Logout del dispositivo actual
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  logout(@CurrentUser() usuario: Usuario): Promise<boolean> {
    return this.authService.logout(usuario.id_usuario);
  }

  // Logout en todos los dispositivos
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  logoutAll(@CurrentUser() usuario: Usuario): Promise<boolean> {
    return this.authService.logoutAll(usuario.id_usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Usuario)
  me(@CurrentUser() usuario: Usuario): Usuario {
    return usuario;
  }

  @Mutation(() => Boolean)
  forgotPassword(
    @Args('input') input: ForgotPasswordInput,
  ): Promise<boolean> {
    return this.authService.forgotPassword(input.correo);
  }

  @Mutation(() => Boolean)
  resetPassword(
    @Args('input') input: ResetPasswordInput,
  ): Promise<boolean> {
    return this.authService.resetPassword(input.token, input.nueva_password);
  }
}