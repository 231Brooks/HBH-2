'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export function CreateKPIButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create KPI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New KPI</DialogTitle>
          <DialogDescription>
            Create a new Key Performance Indicator to track your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <p>KPI creation form will be implemented here</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
