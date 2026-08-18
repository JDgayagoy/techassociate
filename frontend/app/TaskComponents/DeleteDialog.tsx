import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteDialogProps {
    id: number,
    onTaskDeleted: () => void
}

export default function DeleteDialog({id, onTaskDeleted}: DeleteDialogProps) {
    const handleDelete = async () => {
        try{
            const response = await fetch(`http://localhost:3000/task/${id}`, {
                method: "DELETE",
                headers: {'Content-Type' : 'application/json'},
            })
            if (!response.ok) {
                const data = await response.json().catch(() => null)
                throw new Error(data?.message || `Failed to delete task`)
            }
            onTaskDeleted();
        }catch(err){
            alert(err instanceof Error ? err.message : 'Failed to delete task')
        }
    }

    return(
    <AlertDialog>
        <AlertDialogTrigger asChild>
        <Button className="bg-transparent text-red-500 w-30  hover:bg-red-300 hover:text-white flex justify-start">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this task.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    )}


