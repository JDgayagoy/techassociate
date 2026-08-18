"use client"

import { MoreHorizontalIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import DeleteDialog from "./DeleteDialog"
import EditTask from "./EditTask"
import { Checkbox } from "@/components/ui/checkbox"

type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
}

type TaskTableProps = {
  onTaskCreated: () => void
  tasks: Task[]
}

export default function TaskTable({
  tasks,
  onTaskCreated,
}: TaskTableProps) {
  const [editTaskId, setEditTaskId] = useState<number | null>(null)
  return (
    <>
      <Table className="rounded-2xl overflow-hidden mt-2">

        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center"
              >
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-8 align-top">
                  {item.id}
                </TableCell>
                <TableCell className="pl-5 align-top w-60">
                  {item.title}
                </TableCell>
                <TableCell className="align-top">
                  {item.description}
                </TableCell>
                <TableCell className="w-5">
                  <Checkbox className="ml-3"
                    checked={item.completed}
                    onCheckedChange={ async(checked) => {
                        try {
                            const response = await fetch(`http://localhost:3000/task/${item.id}`, {
                                method: "PATCH",
                                headers: {"Content-Type" : "application/json"},
                                body: JSON.stringify({
                                    completed: checked === true
                                }),
                            });
                            if(!response.ok){
                                const data = await response.json().catch(() => null)
                                throw new Error(data?.message || "Failed to update status")
                            }
                            onTaskCreated()
                        }catch(err){
                            alert(err instanceof Error ? err.message : 'Failed to update task status')
                        }
                    }}
                  ></Checkbox>
                </TableCell>
                <TableCell className="text-right align-top w-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                        >
                          <MoreHorizontalIcon />
                          <span className="sr-only">
                            Open menu
                          </span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      {/* EDIT */}
                      <DropdownMenuItem
                        onClick={() => {
                          setEditTaskId(item.id)
                        }}
                      >
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeleteDialog
                        id={item.id}
                        onTaskDeleted={onTaskCreated}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {editTaskId !== null && (

        <EditTask
          id={editTaskId}

          initialTitle={
            tasks.find(
              (task) => task.id === editTaskId
            )?.title ?? ""
          }

          initialDescription={
            tasks.find(
              (task) => task.id === editTaskId
            )?.description ?? ""
          }

          open={true}

          onOpenChange={(open) => {
            if (!open) {
              setEditTaskId(null)
            }
          }}

          onEditTask={() => {
            setEditTaskId(null)
            onTaskCreated()
          }}
        />

      )}

    </>
  )
}