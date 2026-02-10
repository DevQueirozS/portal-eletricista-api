/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfissionalService } from './profissional.service';

@Controller('profissional')
export class ProfissionalController {
  constructor(private service: ProfissionalService) {}

  @Post('register')
  register(
    @Body()
    data: {
      nome: string;
      email: string;
      senha: string;
      cidade: string;
      bairro: string;
    },
  ) {
    return this.service.register(data);
  }

  @Get('see-all')
  seeAll() {
    return this.service.seeAll();
  }

  @Get('total')
  async countProfissionais() {
    return this.service.contarProfissionais();
  }

  @Get('/top-avaliados')
  getTopAvaliados() {
    return this.service.findTopAvaliados();
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.service.findById(Number(id));
  }

  @Put('complete-profile')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'fotoPerfil', maxCount: 1 },
        { name: 'documentos', maxCount: 2 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'fotoPerfil') {
              cb(null, 'uploads/foto-perfil');
            } else if (file.fieldname === 'documentos') {
              // Define pasta conforme o índice do arquivo no array documentos
              const index = (req as any).fileIndex ?? 0;
              (req as any).fileIndex = index + 1;

              if (index === 0) {
                cb(null, 'uploads/documentos-tecnico/frente');
              } else {
                cb(null, 'uploads/documentos-tecnico/verso');
              }
            } else {
              cb(null, 'uploads/others');
            }
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async completeProfile(
    @Body()
    body: {
      id: number;
      bio: string;
      telefone: string;
      especialidades: string[];
    },
    @UploadedFiles()
    files: {
      fotoPerfil?: Express.Multer.File[];
      documentos?: Express.Multer.File[];
    },
    @Req() req: Request,
  ) {
    console.log('Arquivos recebidos:', files);
    const fotoPerfilUrl =
      files.fotoPerfil && files.fotoPerfil[0]
        ? `${req.protocol}://${req.get('host')}/uploads/foto-perfil/${files.fotoPerfil[0].filename}`
        : null;

    const fotoFrenteUrl =
      files.documentos && files.documentos[0]
        ? `${req.protocol}://${req.get('host')}/uploads/documentos-tecnico/frente/${files.documentos[0].filename}`
        : null;

    const fotoVersoUrl =
      files.documentos && files.documentos[1]
        ? `${req.protocol}://${req.get('host')}/uploads/documentos-tecnico/verso/${files.documentos[1].filename}`
        : null;

    return this.service.completeProfile({
      id: body.id,
      bio: body.bio,
      telefone: body.telefone,
      especialidades: body.especialidades,
      fotoUrl: fotoPerfilUrl, // foto principal do perfil
      fotoFrenteUrl,
      fotoVersoUrl,
    });
  }

  @Get('account/:email')
  getAccount(@Param('email') email: string) {
    return this.service.findByEmail(email);
  }

  @Put('edit-profile')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async editProfile(
    @Body()
    body: {
      id: number;
      nome?: string;
      email: string;
      telefone?: string;
      bio?: string;
    },
    @Req() req: Request,
    @UploadedFile() foto?: Express.Multer.File,
  ) {
    const fotoUrl = foto
      ? `${req.protocol}://${req.get('host')}/uploads/${foto.filename}`
      : undefined;

    return this.service.updateProfile({
      id: body.id,
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      fotoUrl,
      bio: body.bio,
    });
  }

  @Put('change-password')
  async changePassword(
    @Body() body: { id: number; senhaAtual: string; novaSenha: string },
  ) {
    return this.service.changePassword(body);
  }

  @Put('recovery-password')
  async changePasswordByEmail(
    @Body() body: { email: string; senhaAtual: string; novaSenha: string },
  ) {
    return this.service.changePasswordByEmail(body);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number) {
    return this.service.deletarProfissional(Number(id));
  }
}
