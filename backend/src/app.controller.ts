import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
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
    if (status && !['completed', 'pending'].includes(status)) {
      throw new BadRequestException('Status must be "completed" or "pending"');
    }
    return this.taskService.getAll(status);
  }

  @Post('task')
  async createTask(
    @Body() taskData: { title: string; description?: string }
  ) {
    if (!taskData.title || taskData.title.trim().length === 0) {
      throw new BadRequestException('Title is required');
    }
    return this.taskService.createTask({
      ...taskData,
      title: taskData.title.trim(),
    });
  }

  @Patch('task/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() data: Prisma.TaskUpdateInput,
  ) {
    const taskId = Number(id);
    if (isNaN(taskId) || taskId <= 0) {
      throw new BadRequestException('Invalid task ID');
    }
    if (data.title !== undefined) {
      const titleValue = typeof data.title === 'string' ? data.title : (data.title as any)?.set;
      if (typeof titleValue === 'string' && titleValue.trim().length === 0) {
        throw new BadRequestException('Title cannot be empty');
      }
    }
    return this.taskService.updateTask({
      where: {
        id: taskId,
      },
      data,
    });
  }

  @Delete('task/:id')
  async deleteTask(@Param('id') id: string) {
    const taskId = Number(id);
    if (isNaN(taskId) || taskId <= 0) {
      throw new BadRequestException('Invalid task ID');
    }
    return this.taskService.deleteTask({
      id: taskId,
    });
  }
}
