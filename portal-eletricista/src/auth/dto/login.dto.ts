/* eslint-disable prettier/prettier */
// src/auth/dto/login.dto.ts
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha: string;

  @IsString({ message: 'Tipo deve ser uma string' })
  @IsIn(['cliente', 'profissional', 'admin'], {
    message: 'Tipo deve ser cliente, profissional ou admin',
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  tipo: 'cliente' | 'profissional' | 'admin';
}
