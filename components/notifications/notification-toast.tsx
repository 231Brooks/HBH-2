"use client"

import { X } from "lucide-react"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  title: string
  description: string
  type?: "default" | "success" | "error" | "warning" | "info"
}

interface NotificationToastProps {
  notification: Notification
  onDismiss: (id: string) => void
}

export function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  const { id, title, description, type = "default" } = notification

  return (
    <Toast
      className={cn(
        type === "success" && "border-green-500 bg-green-50 dark:bg-green-900/20",
        type === "error" && "border-red-500 bg-red-50 dark:bg-red-900/20",
        type === "warning" && "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
        type === "info" && "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
      )}
    >
      <div className="flex justify-between gap-2">
        <div className="grid gap-1">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </div>
        <ToastClose asChild onClick={() => onDismiss(id)}>
          <button className="rounded-full p-1 hover:bg-muted">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </ToastClose>
      </div>
    </Toast>
  )
}
