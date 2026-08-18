"use client"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import type { SubmitEvent } from "react"

interface EditTaskProps {
  id: number
  initialTitle: string
  initialDescription?: string

  open: boolean
  onOpenChange: (open: boolean) => void

  onEditTask: () => void
}

export default function EditTask({
  id,
  initialTitle,
  initialDescription,
  open,
  onOpenChange,
  onEditTask,
}: EditTaskProps) {

  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(
    initialDescription ?? ""
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Update form values when another task is selected
  useEffect(() => {
    setTitle(initialTitle)
    setDescription(initialDescription ?? "")
    setError('')
  }, [initialTitle, initialDescription])

  const handleSubmit = async (
    e: SubmitEvent<HTMLFormElement>
  ) => {

    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3000/task/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(
          data?.message || `Request failed: ${response.status}`
        )
      }
      onOpenChange(false)
      onEditTask()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (

    <Dialog
      open={open}
      onOpenChange={(isOpen) => { onOpenChange(isOpen); if (!isOpen) setError(''); }}
    >
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Edit Task
            </DialogTitle>
          </DialogHeader>
          {error && (
            <p className="text-sm text-red-500 px-1">{error}</p>
          )}
          <FieldGroup>
            <Field>
              <Label htmlFor="task-title">
                Title
              </Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (error) setError('')
                }}
              />
            </Field>

            <Field>
              <Label htmlFor="task-description">
                Description
              </Label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="border-gray rounded-xl h-40 p-2 w-full"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  )
}