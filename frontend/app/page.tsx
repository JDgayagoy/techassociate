"use client"

import { useState, useEffect } from "react"
import TaskTable from "./TaskComponents/TaskTable"
import { CreateTask } from "./TaskComponents/CreateTask"
import TaskFilter from "./TaskComponents/TaskFilter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function fetchTask(statusFilter = "all") {
    const url =
      statusFilter === "all"
        ? "http://localhost:3000/task"
        : `http://localhost:3000/task?status=${statusFilter}`
    setLoading(true)
    setError("")
    try {
      const response = await fetch(url)
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || `Request failed: ${response.status}`)
      }
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Cannot connect to the server. Make sure the backend is running.")
      } else {
        setError(err instanceof Error ? err.message : "Failed to load tasks")
      }
    } finally {
      setLoading(false)
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={() => fetchTask(status)}>
              Retry
            </Button>
          </div>
        ) : (
          <TaskTable
            tasks={filteredTasks}
            onTaskCreated={() => fetchTask(status)}
          />
        )}
      </main>
    </div>
  )
}