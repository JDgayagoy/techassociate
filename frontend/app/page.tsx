"use client"

import { useState, useEffect } from "react"
import TaskTable from "./TaskComponents/TaskTable"
import { CreateTask } from "./TaskComponents/CreateTask"
import TaskFilter from "./TaskComponents/TaskFilter"
import { Input } from "@/components/ui/input"

type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
}

export default function Home() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [status, setStatus] = useState("all")
  const [search, setSearch] = useState("")

  async function fetchTask(statusFilter = "all") {
    const url =
      statusFilter === "all"
        ? "http://localhost:3000/task"
        : `http://localhost:3000/task?status=${statusFilter}`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }
      const data = await response.json()
      console.log(data)
      setTasks(data)
    } catch (err) {
      console.log(err)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchesStatus =
      status === "all" ||
      (status === "completed" && task.completed) ||
      (status === "pending" && !task.completed)
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    fetchTask(status)
  }, [status])

  return (
    <div>
      <h1 className="pl-15 mt-8 text-3xl font-semi">Task List</h1>
      <main className="px-15 mt-4">
        <div className="flex justify-between">
          <CreateTask
            onTaskCreated={() => fetchTask(status)}
          />
          <div className="flex gap-5">
            <div className="flex gap-2">
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <TaskFilter
              status={status}
              setStatus={setStatus}
            />
          </div>
        </div>
        <TaskTable
          tasks={filteredTasks}
          onTaskCreated={() => fetchTask(status)}
        />
      </main>
    </div>
  )
}