"use client"

import React from "react"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

/**
 * Reusable loading spinner component
 */
export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

/**
 * Full page loading overlay
 */
export function LoadingOverlay({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-lg font-medium">{text}</p>
      </div>
    </div>
  )
}

/**
 * Skeleton loading component for content placeholders
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

/**
 * Card skeleton for loading states
 */
export function CardSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

/**
 * List skeleton for loading states
 */
export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Table skeleton for loading states
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-3">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Status indicator component
 */
interface StatusIndicatorProps {
  status: "loading" | "success" | "error" | "idle"
  loadingText?: string
  successText?: string
  errorText?: string
  className?: string
}

export function StatusIndicator({
  status,
  loadingText = "Loading...",
  successText = "Success",
  errorText = "Error",
  className
}: StatusIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getText = () => {
    switch (status) {
      case "loading":
        return loadingText
      case "success":
        return successText
      case "error":
        return errorText
      default:
        return ""
    }
  }

  const getTextColor = () => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  if (status === "idle") return null

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {getIcon()}
      <span className={cn("text-sm", getTextColor())}>{getText()}</span>
    </div>
  )
}

/**
 * Progress bar component
 */
interface ProgressBarProps {
  progress: number
  className?: string
  showPercentage?: boolean
  text?: string
}

export function ProgressBar({ progress, className, showPercentage = true, text }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className={cn("space-y-2", className)}>
      {(text || showPercentage) && (
        <div className="flex justify-between text-sm">
          {text && <span className="text-muted-foreground">{text}</span>}
          {showPercentage && <span className="font-medium">{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Empty state component
 */
interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/**
 * Error state component
 */
interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this content.",
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

/**
 * Loading button content
 */
export function LoadingButtonContent({ text = "Loading..." }: { text?: string }) {
  return (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {text}
    </>
  )
}
