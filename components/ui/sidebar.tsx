"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ChevronRight } from "lucide-react"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext({
  expanded: true,
  setExpanded: (expanded: boolean) => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = React.useState(true)

  return <SidebarContext.Provider value={{ expanded, setExpanded }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const sidebarVariants = cva(
  "h-screen bg-maybe-dark text-white border-r border-gray-800 transition-all duration-300 flex flex-col overflow-hidden",
  {
    variants: {
      expanded: {
        true: "w-64",
        false: "w-16",
      },
    },
    defaultVariants: {
      expanded: true,
    },
  },
)

export function Sidebar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useSidebar()

  return (
    <div className={cn(sidebarVariants({ expanded }), className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("shrink-0", className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-auto", className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("shrink-0", className)} {...props} />
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { expanded, setExpanded } = useSidebar()

  return (
    <button
      className={cn(
        "absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border border-gray-800 bg-maybe-dark text-gray-400",
        className,
      )}
      onClick={() => setExpanded(!expanded)}
      {...props}
    >
      <ChevronRight className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")} />
    </button>
  )
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1 p-2", className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

const sidebarMenuButtonVariants = cva(
  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-maybe-dark-gray w-full",
  {
    variants: {
      isActive: {
        true: "bg-maybe-purple text-white",
        false: "text-gray-400",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
)

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, asChild = false, ...props }, ref) => {
    const { expanded } = useSidebar()

    if (asChild) {
      return <Slot className={cn(sidebarMenuButtonVariants({ isActive }), className)} ref={ref} {...props} />
    }

    return (
      <button ref={ref} className={cn(sidebarMenuButtonVariants({ isActive }), className)} {...props}>
        {props.children}
        {!expanded && <span className="sr-only">{props.children}</span>}
      </button>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-gray-800 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-maybe-dark",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-maybe-light-gray",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className,
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "h-8 w-full bg-maybe-dark-gray border-gray-700 shadow-none focus-visible:ring-2 focus-visible:ring-maybe-purple focus-visible:border-transparent",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarInput.displayName = "SidebarInput"

const SidebarSeparator = React.forwardRef<React.ElementRef<typeof Separator>, React.ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => {
    return (
      <Separator ref={ref} data-sidebar="separator" className={cn("mx-2 w-auto bg-gray-800", className)} {...props} />
    )
  },
)
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarGroup = React.forwardRef < HTMLDivElement,
  React
.
