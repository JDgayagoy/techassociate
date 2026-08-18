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

  // Update form values when another task is selected
  useEffect(() => {
    setTitle(initialTitle)
    setDescription(initialDescription ?? "")
  }, [initialTitle, initialDescription])

  const handleSubmit = async (
    e: SubmitEvent<HTMLFormElement>
  ) => {

    e.preventDefault()

    try {
      const response = await fetch(
        `http://localhost:3000/task/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        )
      }
      console.log("Task updated successfully")
      onOpenChange(false)
      onEditTask()
    } catch (err) {
      console.error(err)
    }
  }

  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Edit Task
            </DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="task-title">
                Title
              </Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
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
            <Button type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  )
}