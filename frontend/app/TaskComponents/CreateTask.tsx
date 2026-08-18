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
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        if (!title.trim()) {
            setError('Title is required')
            return
        }
        
        setLoading(true)
        try {
            const response = await fetch('http://localhost:3000/task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim(), description })
            })
            if (!response.ok) {
                const data = await response.json().catch(() => null)
                throw new Error(data?.message || `Request failed: ${response.status}`)
            }
            setTitle('')
            setDescription('')
            setError('')
            setOpen(false)
            onTaskCreated()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setError(''); }}>
            <DialogTrigger render={<Button>Create Task</Button>} />
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                    </DialogHeader>
                    {error && (
                        <p className="text-sm text-red-500 px-1">{error}</p>
                    )}
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="task-title">Title</Label>
                            <Input
                                id="task-title"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); if (error) setError(''); }}
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
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}