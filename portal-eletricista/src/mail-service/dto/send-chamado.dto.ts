/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SendChamadoDto {
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsOptional()
  telefone?: string;

  @IsNotEmpty()
  servico: string;
}
