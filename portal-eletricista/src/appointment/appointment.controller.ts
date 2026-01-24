/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('create')
  create(@Body() data: Prisma.AppointmentCreateInput) {
    return this.appointmentService.create(data);
  }

  @Get('all')
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.AppointmentUpdateInput) {
    return this.appointmentService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }

  @Get('cliente/:clienteId')
  findByClienteId(@Param('clienteId') clienteId: string) {
    return this.appointmentService.findByClienteId(+clienteId);
  }

  @Get('profissional/:profissionalId')
  findByProfissionalId(@Param('profissionalId') profissionalId: string) {
    return this.appointmentService.findByProfissionalId(+profissionalId);
  }
}
