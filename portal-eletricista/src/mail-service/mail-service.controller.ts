/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { SendChamadoDto } from './dto/send-chamado.dto';
import { MailService } from './mail-service.service';

@Controller('mail-service')
export class MailServiceController {
  constructor(private readonly mailService: MailService) {}

  @Post('chamado')
  enviarChamado(@Body() dto: SendChamadoDto) {
    return this.mailService.enviarChamado(dto);
  }
}
