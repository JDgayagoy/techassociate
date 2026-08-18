import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskModel } from 'generated/prisma/models';
import { Prisma,Task } from 'generated/prisma/browser';



@Controller()
export class AppController {
  constructor(
    private readonly taskService: TaskService
  ) {}

  @Get('task')
  async getTask(@Query('status') status?: string){
    return this.taskService.getAll(status);
  }

  @Post('task')
  async createTask(
    @Body() taskData: { title: string; description?: string }
  ) {
    return this.taskService.createTask(taskData);
  }

  @Patch('task/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() data: Prisma.TaskUpdateInput,
  ) {
    return this.taskService.updateTask({
      where: {
        id: Number(id),
      },
      data,
    });
  }

  @Delete('task/:id')
  async deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask({
      id: Number(id),
    });
  }
}
