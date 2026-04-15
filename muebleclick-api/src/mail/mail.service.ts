import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(configService.get<string>('RESEND_API_KEY'));
  }

  async sendPasswordReset(
    correo: string,
    nombre: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    const from = this.configService.getOrThrow<string>('RESEND_FROM_EMAIL');

    try {
      await this.resend.emails.send({
        from,
        to: correo,
        subject: 'Recupera tu contraseña — MuebleClick',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="margin:0;padding:0;background:#F7F3EE;font-family:system-ui,sans-serif;">
            <div style="max-width:520px;margin:40px auto;padding:20px;">

              <!-- Header -->
              <div style="background:linear-gradient(135deg,#2D6A4F,#1B4332);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
                <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                  <span style="font-size:24px;">🌿</span>
                </div>
                <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">MuebleClick</h1>
                <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Panel de administración</p>
              </div>

              <!-- Body -->
              <div style="background:white;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                <h2 style="color:#1C1917;font-size:18px;font-weight:700;margin:0 0 8px;">
                  Hola, ${nombre} 👋
                </h2>
                <p style="color:#78716C;font-size:14px;line-height:1.6;margin:0 0 24px;">
                  Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                  Si no fuiste tú, puedes ignorar este mensaje.
                </p>

                <!-- CTA -->
                <div style="text-align:center;margin:32px 0;">
                  <a
                    href="${resetUrl}"
                    style="display:inline-block;background:linear-gradient(135deg,#2D6A4F,#1B4332);color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600;box-shadow:0 4px 12px rgba(27,67,50,0.3);"
                  >
                    Restablecer contraseña
                  </a>
                </div>

                <p style="color:#78716C;font-size:12px;text-align:center;margin:0 0 8px;">
                  Este enlace expira en <strong>1 hora</strong>.
                </p>
                <p style="color:#78716C;font-size:12px;text-align:center;margin:0;">
                  O copia y pega este enlace en tu navegador:
                </p>
                <p style="color:#2D6A4F;font-size:11px;text-align:center;word-break:break-all;margin:8px 0 0;">
                  ${resetUrl}
                </p>
              </div>

              <!-- Footer -->
              <p style="color:#A8A29E;font-size:11px;text-align:center;margin:20px 0 0;">
                © ${new Date().getFullYear()} MuebleClick — Este correo fue enviado automáticamente.
              </p>
            </div>
          </body>
          </html>
        `,
      });

      this.logger.log(`Email de recuperación enviado a ${correo}`);
    } catch (error) {
      this.logger.error(`Error enviando email a ${correo}:`, error);
      throw new Error('No se pudo enviar el correo de recuperación');
    }
  }
}