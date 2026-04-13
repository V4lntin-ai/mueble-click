import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../modules/usuarios/usuarios.service';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response.type';
import { CreateUsuarioInput } from '../modules/usuarios/dto/create-usuario.input';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(input: LoginInput): Promise<AuthResponse> {
    const usuario = await this.usuariosService.findByCorreo(input.correo);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await this.usuariosService.validatePassword(
      usuario,
      input.password,
    );

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generarTokens(usuario);
  }

  async register(input: CreateUsuarioInput): Promise<AuthResponse> {
    const usuario = await this.usuariosService.create(input);
    return this.generarTokens(usuario);
  }

  async refreshTokens(usuario: Usuario): Promise<AuthResponse> {
    return this.generarTokens(usuario);
  }

  private generarTokens(usuario: Usuario): AuthResponse {
    const payload = { sub: usuario.id_usuario, correo: usuario.correo };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN') as StringValue,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN') as StringValue,
    });

    return { access_token, refresh_token, usuario };
  }
}