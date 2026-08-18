import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Task,Prisma } from "generated/prisma/client";

@Injectable()
export class TaskService{
    constructor(private prisma: PrismaService) {}
    
    async getAll(status?: string) {

        if(status === "completed"){
            return this.prisma.task.findMany({
                where: {
                    completed: true,
                }
            });
        }

        if(status === "pending"){
            return this.prisma.task.findMany({
                where: {
                    completed: false
                }
            });
        }

        return this.prisma.task.findMany();
    }

    async createTask(data: Prisma.TaskCreateInput): Promise<Task>{
        try {
            return await this.prisma.task.create({
                data,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('A task with this title already exists');
                }
            }
            throw error;
        }
    }

    async updateTask(param: {
        where: Prisma.TaskWhereUniqueInput;
        data: Prisma.TaskUpdateInput;
    }): Promise<Task>{
        const {data, where} = param;
        try {
            return await this.prisma.task.update({
                data,
                where
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(`Task with ID ${where.id} not found`);
                }
                if (error.code === 'P2002') {
                    throw new ConflictException('A task with this title already exists');
                }
            }
            throw error;
        }
    }

    async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<Task>{
        try {
            return await this.prisma.task.delete({
                where
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException(`Task with ID ${where.id} not found`);
                }
            }
            throw error;
        }
    }
}