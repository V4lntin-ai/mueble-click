import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { UsuariosService } from '../modules/usuarios/usuarios.service';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response.type';
import { CreateUsuarioInput } from '../modules/usuarios/dto/create-usuario.input';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
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

    const tokens = this.generarTokens(usuario);

    // Guardar refresh token en BD
    await this.usuariosService.saveRefreshToken(
      usuario.id_usuario,
      tokens.refresh_token,
    );

    return tokens;
  }

  async register(input: CreateUsuarioInput): Promise<AuthResponse> {
    const usuario = await this.usuariosService.create(input);
    const tokens = this.generarTokens(usuario);
    await this.usuariosService.saveRefreshToken(
      usuario.id_usuario,
      tokens.refresh_token,
    );
    return tokens;
  }

  async refresh(usuario: Usuario): Promise<AuthResponse> {
    const tokens = this.generarTokens(usuario);
    await this.usuariosService.saveRefreshToken(
      usuario.id_usuario,
      tokens.refresh_token,
    );
    return tokens;
  }

  async logout(id_usuario: number): Promise<boolean> {
    await this.usuariosService.clearRefreshToken(id_usuario);
    return true;
  }

  async logoutAll(id_usuario: number): Promise<boolean> {
    await this.usuariosService.clearAllSessions(id_usuario);
    return true;
  }

  private generarTokens(usuario: Usuario): AuthResponse {
    const payload = { sub: usuario.id_usuario, correo: usuario.correo };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_EXPIRES_IN',
      ) as unknown as StringValue,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_REFRESH_EXPIRES_IN',
      ) as unknown as StringValue,
    });

    return { access_token, refresh_token, usuario };
  }

  async forgotPassword(correo: string): Promise<boolean> {
    try {
      const { token, usuario } = await this.usuariosService.guardarResetToken(correo);
      await this.mailService.sendPasswordReset(correo, usuario.nombre, token);
    } catch {
      // No revelar si el correo existe o no por seguridad
    }
    return true;
  }

  async resetPassword(token: string, nuevaPassword: string): Promise<boolean> {
    return this.usuariosService.resetPassword(token, nuevaPassword);
  }
}