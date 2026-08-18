import { Injectable } from "@nestjs/common";
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
        return this.prisma.task.create({
            data,
        });
    }

    async updateTask(param: {
        where: Prisma.TaskWhereUniqueInput;
        data: Prisma.TaskUpdateInput;
    }): Promise<Task>{
        const {data, where} = param;
        return this.prisma.task.update({
            data,
            where
        });
    }

    async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<Task>{
        return this.prisma.task.delete({
            where
        });
    }
}