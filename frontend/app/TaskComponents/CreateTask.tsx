"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { SubmitEvent } from 'react'

export function CreateTask({onTaskCreated} : { onTaskCreated: () => void}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        try {
            const response = await fetch('http://localhost:3000/task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })
            if (!response.ok) throw new Error(`Request failed: ${response.status}`)
            setTitle('')
            setDescription('')
            setOpen(false)
            onTaskCreated()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button>Create Task</Button>} />
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="task-title">Title</Label>
                            <Input
                                id="task-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="task-description">Description</Label>
                            <textarea
                                id="task-description"
                                className="border-gray border rounded-xl h-40 p-2"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}