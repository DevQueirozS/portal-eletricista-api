/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendChamadoDto } from './dto/send-chamado.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('SMTP2GO_USER');
    const pass = this.configService.get<string>('SMTP2GO_PASS');

    if (!user || !pass) {
      throw new Error('Variáveis SMTP2GO_USER e SMTP2GO_PASS são obrigatórias');
    }

    this.transporter = nodemailer.createTransport({
      host: 'mail.smtp2go.com',
      port: 587,
      secure: false,
      auth: { user, pass },
    });
  }

  /**
   * Envia email para um ou vários destinatários
   * @param to - Lista de destinatários (string ou array de strings)
   * @param subject - Assunto do email
   * @param text - Corpo do email em texto
   * @param html - (opcional) Corpo do email em HTML
   */
  async sendEmail(
    to: string | string[],
    subject: string,
    text: string,
    html?: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: 'Portal Eletricista <no-reply@techmanlight.pt>',
        to: Array.isArray(to) ? to.join(',') : to,
        subject,
        text,
        html,
      });
      return { message: 'Email enviado com sucesso' };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new InternalServerErrorException('Falha ao enviar email');
    }
  }

  async enviarChamado(dto: SendChamadoDto) {
    const { nome, email, telefone, local, dataHora, servico } = dto;

    const html = `
    <h2>Novo Pedido de Serviço</h2>
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${telefone ? `<p><strong>Telefone:</strong> ${telefone}</p>` : ''}
    <p><strong>Local:</strong> ${local}</p>
    <p><strong>Data e Horário:</strong> ${dataHora}</p>
    <p><strong>Serviço:</strong> ${servico}</p>
  `;

    await this.sendEmail(
      [email, 'neomamlight@hotmail.com', 'admin@firstmedia.pt'],
      'Novo Pedido de Serviço - Tech Manlight',
      '',
      html,
    );
  }
}
