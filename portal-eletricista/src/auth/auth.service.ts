/* eslint-disable prettier/prettier */
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';
import { ClienteService } from '../cliente/cliente.service';
import { ProfissionalService } from '../profissional/profissional.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly clienteService: ClienteService,
    private readonly profissionalService: ProfissionalService,
    private readonly adminService: AdminService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, senha, tipo } = loginDto;

    let user: any;

    if (tipo === 'cliente') {
      user = await this.clienteService.findByEmail(email);
    } else if (tipo === 'profissional') {
      user = await this.profissionalService.findByEmail(email);
    } else if (tipo === 'admin') {
      user = await this.adminService.findByEmail(email);
    }

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email, tipo };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      id: user.id, // Aqui está o ID retornado junto
    };
  }
}
