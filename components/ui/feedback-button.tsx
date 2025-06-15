"use client"

import React, { useState } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { Loader2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => Promise<void> | void
  loadingText?: string
  successText?: string
  errorText?: string
  showSuccessIcon?: boolean
  showErrorIcon?: boolean
  resetDelay?: number
  disabled?: boolean
}

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Button component that provides visual feedback for async operations
 * Automatically handles loading, success, and error states
 */
export function FeedbackButton({
  onClick,
  children,
  loadingText = "Loading...",
  successText = "Success!",
  errorText = "Error",
  showSuccessIcon = true,
  showErrorIcon = true,
  resetDelay = 2000,
  disabled = false,
  className,
  ...props
}: FeedbackButtonProps) {
  const [state, setState] = useState<ButtonState>('idle')

  const handleClick = async () => {
    if (state === 'loading' || disabled) return

    setState('loading')

    try {
      await onClick()
      setState('success')
      
      // Reset to idle after delay
      setTimeout(() => {
        setState('idle')
      }, resetDelay)
    } catch (error) {
      setState('error')
      
      // Reset to idle after delay
      setTimeout(() => {
        setState('idle')
      }, resetDelay)
    }
  }

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        )
      case 'success':
        return (
          <>
            {showSuccessIcon && <Check className="mr-2 h-4 w-4" />}
            {successText}
          </>
        )
      case 'error':
        return (
          <>
            {showErrorIcon && <X className="mr-2 h-4 w-4" />}
            {errorText}
          </>
        )
      default:
        return children
    }
  }

  const getButtonVariant = () => {
    switch (state) {
      case 'success':
        return 'default'
      case 'error':
        return 'destructive'
      default:
        return props.variant || 'default'
    }
  }

  return (
    <Button
      {...props}
      variant={getButtonVariant()}
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      className={cn(
        "transition-all duration-200",
        state === 'success' && "bg-green-600 hover:bg-green-700",
        className
      )}
    >
      {getButtonContent()}
    </Button>
  )
}

/**
 * Specialized button for form submissions
 */
export function SubmitButton({
  children = "Submit",
  loadingText = "Submitting...",
  successText = "Submitted!",
  ...props
}: Omit<FeedbackButtonProps, 'type'>) {
  return (
    <FeedbackButton
      type="submit"
      loadingText={loadingText}
      successText={successText}
      {...props}
    >
      {children}
    </FeedbackButton>
  )
}

/**
 * Specialized button for save operations
 */
export function SaveButton({
  children = "Save",
  loadingText = "Saving...",
  successText = "Saved!",
  ...props
}: FeedbackButtonProps) {
  return (
    <FeedbackButton
      loadingText={loadingText}
      successText={successText}
      {...props}
    >
      {children}
    </FeedbackButton>
  )
}

/**
 * Specialized button for delete operations
 */
export function DeleteButton({
  children = "Delete",
  loadingText = "Deleting...",
  successText = "Deleted!",
  errorText = "Failed to delete",
  ...props
}: FeedbackButtonProps) {
  return (
    <FeedbackButton
      variant="destructive"
      loadingText={loadingText}
      successText={successText}
      errorText={errorText}
      {...props}
    >
      {children}
    </FeedbackButton>
  )
}

/**
 * Specialized button for copy operations
 */
export function CopyButton({
  textToCopy,
  children = "Copy",
  successText = "Copied!",
  errorText = "Failed to copy",
  ...props
}: Omit<FeedbackButtonProps, 'onClick'> & { textToCopy: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy)
  }

  return (
    <FeedbackButton
      onClick={handleCopy}
      successText={successText}
      errorText={errorText}
      {...props}
    >
      {children}
    </FeedbackButton>
  )
}
