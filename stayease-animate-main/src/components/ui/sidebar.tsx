  import * as React from "react"
  import { Slot } from "@radix-ui/react-slot"
  import { VariantProps, cva } from "class-variance-authority"
  import { PanelLeft, X, ChevronRight } from "lucide-react"

  import { useIsMobile } from "@/hooks/use-mobile"
  import { cn } from "@/lib/utils"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Separator } from "@/components/ui/separator"
  import { Sheet, SheetContent } from "@/components/ui/sheet"
  import { Skeleton } from "@/components/ui/skeleton"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

  const SIDEBAR_COOKIE_NAME = "sidebar:state"
  const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
  const SIDEBAR_WIDTH = "16rem"
  const SIDEBAR_WIDTH_MOBILE = "18rem"
  const SIDEBAR_WIDTH_ICON = "3.5rem"
  const SIDEBAR_KEYBOARD_SHORTCUT = "b"

// Icon color presets for colorful collapsed sidebar
const ICON_COLORS = {
  blue: "text-primary",
  green: "text-success",
  purple: "text-accent",
  red: "text-destructive",
  orange: "text-warning",
  pink: "text-pink-500",
  indigo: "text-indigo-500",
  teal: "text-teal-500",
  cyan: "text-cyan-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  rose: "text-rose-500",
  amber: "text-amber-500",
  lime: "text-lime-500",
  sky: "text-sky-500",
} as const

type SidebarContext = {
    state: "expanded" | "collapsed"
    open: boolean
    setOpen: (open: boolean) => void
    openMobile: boolean
    setOpenMobile: (open: boolean) => void
    isMobile: boolean
    toggleSidebar: () => void
  }

  const SidebarContext = React.createContext<SidebarContext | null>(null)

  function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
      throw new Error("useSidebar must be used within a SidebarProvider.")
    }

    return context
  }

  const SidebarProvider = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
      defaultOpen?: boolean
      open?: boolean
      onOpenChange?: (open: boolean) => void
    }
  >(
    (
      {
        defaultOpen = true,
        open: openProp,
        onOpenChange: setOpenProp,
        className,
        style,
        children,
        ...props
      },
      ref
    ) => {
      const isMobile = useIsMobile()
      const [openMobile, setOpenMobile] = React.useState(false)

      // This is the internal state of the sidebar.
      // We use openProp and setOpenProp for control from outside the component.
      const [_open, _setOpen] = React.useState(defaultOpen)
      const open = openProp ?? _open
      const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
          const openState = typeof value === "function" ? value(open) : value
          if (setOpenProp) {
            setOpenProp(openState)
          } else {
            _setOpen(openState)
          }

          // This sets the cookie to keep the sidebar state.
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        },
        [setOpenProp, open]
      )

      // Helper to toggle the sidebar.
      const toggleSidebar = React.useCallback(() => {
        return isMobile
          ? setOpenMobile((open) => !open)
          : setOpen((open) => !open)
      }, [isMobile, setOpen, setOpenMobile])

      // Adds a keyboard shortcut to toggle the sidebar.
      React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (
            event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
            (event.metaKey || event.ctrlKey)
          ) {
            event.preventDefault()
            toggleSidebar()
          }
        }

        // Only add keyboard shortcut on desktop
        if (!isMobile) {
          window.addEventListener("keydown", handleKeyDown)
          return () => window.removeEventListener("keydown", handleKeyDown)
        }
      }, [toggleSidebar, isMobile])

      // We add a state so that we can do data-state="expanded" or "collapsed".
      // This makes it easier to style the sidebar with Tailwind classes.
      const state = open ? "expanded" : "collapsed"

      const contextValue = React.useMemo<SidebarContext>(
        () => ({
          state,
          open,
          setOpen,
          isMobile,
          openMobile,
          setOpenMobile,
          toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
      )

      return (
        <SidebarContext.Provider value={contextValue}>
          <TooltipProvider delayDuration={0}>
            <div
              style={
                {
                  "--sidebar-width": SIDEBAR_WIDTH,
                  "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                  ...style,
                } as React.CSSProperties
              }
              className={cn(
                "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
                className
              )}
              ref={ref}
              {...props}
            >
              {children}
            </div>
          </TooltipProvider>
        </SidebarContext.Provider>
      )
    }
  )
  SidebarProvider.displayName = "SidebarProvider"

  const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
      side?: "left" | "right"
      variant?: "sidebar" | "floating" | "inset"
      collapsible?: "offcanvas" | "icon" | "none"
    }
  >(
    (
      {
        side = "left",
        variant = "sidebar",
        collapsible = "offcanvas",
        className,
        children,
        ...props
      },
      ref
    ) => {
      const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

      if (collapsible === "none") {
        return (
          <div
            className={cn(
              "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border/50",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        )
      }

      if (isMobile) {
        return (
          <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
            <SheetContent
              data-sidebar="sidebar"
              data-mobile="true"
              className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden border-r-0 shadow-xl"
              style={
                {
                  "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
                } as React.CSSProperties
              }
              side={side}
            >
              <div className="flex h-full w-full flex-col overflow-hidden">
                {/* Enhanced Mobile Header with Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-sidebar-border/50 bg-sidebar/95 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-sidebar-accent to-sidebar-accent/80 rounded-lg flex items-center justify-center shadow-sm">
                      <PanelLeft className="w-5 h-5 text-sidebar-accent-foreground" />
                    </div>
                    <span className="font-semibold text-sidebar-foreground">Navigation</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpenMobile(false)}
                    className="h-9 w-9 p-0 rounded-lg hover:bg-sidebar-accent transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain py-2">
                  {children}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )
      }

      return (
        <div
          ref={ref}
          className="group peer hidden md:block text-sidebar-foreground"
          data-state={state}
          data-collapsible={state === "collapsed" ? collapsible : ""}
          data-variant={variant}
          data-side={side}
        >
          {/* This is what handles the sidebar gap on desktop */}
          <div
            className={cn(
              "duration-300 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-in-out",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset"
                ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
                : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
            )}
          />
          <div
            className={cn(
              "duration-300 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-in-out md:flex",
              side === "left"
                ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
                : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset"
                ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
                : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
              "backdrop-blur-sm",
              className
            )}
            {...props}
          >
            <div
              data-sidebar="sidebar"
              className="flex h-full w-full flex-col bg-sidebar/95 backdrop-blur-md group-data-[variant=floating]:rounded-xl group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border/50 group-data-[variant=floating]:shadow-lg transition-all duration-300"
            >
              {children}
            </div>
          </div>
        </div>
      )
    }
  )
  Sidebar.displayName = "Sidebar"

  const SidebarTrigger = React.forwardRef<
    React.ElementRef<typeof Button>,
    React.ComponentProps<typeof Button>
  >(({ className, onClick, ...props }, ref) => {
    const { toggleSidebar, isMobile, state } = useSidebar()

    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn(
          "h-10 w-10 md:h-9 md:w-9 rounded-lg", // Larger touch target on mobile
          "active:scale-95 transition-all duration-200", // Better mobile feedback
          "bg-sidebar-accent/10 hover:bg-sidebar-accent/20", // Subtle background
          "shadow-sm hover:shadow", // Soft shadow
          // Better centering for collapsed state
          state === "collapsed" && "justify-center items-center",
          className
        )}
        onClick={(event) => {
          onClick?.(event)
          toggleSidebar()
        }}
        {...props}
      >
        {state === "collapsed" ? (
          <ChevronRight className="h-5 w-5 text-blue-500 transition-transform duration-200 hover:scale-110" />
        ) : (
          <PanelLeft className="h-5 w-5 md:h-4.5 md:w-4.5 text-sidebar-foreground transition-transform duration-200 hover:scale-110" />
        )}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    )
  })
  SidebarTrigger.displayName = "SidebarTrigger"

  const SidebarRail = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button">
  >(({ className, ...props }, ref) => {
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
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-in-out after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:rounded-full hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className
        )}
        {...props}
      />
    )
  })
  SidebarRail.displayName = "SidebarRail"

  const SidebarInset = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"main">
  >(({ className, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "relative flex min-h-svh flex-1 flex-col bg-background",
          // Mobile-first responsive design
          "px-4 py-6 md:px-6 md:py-8", // Better mobile padding
          "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]",
          "md:peer-data-[variant=inset]:m-3",
          "md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-3",
          "md:peer-data-[variant=inset]:ml-0",
          "md:peer-data-[variant=inset]:rounded-xl",
          "md:peer-data-[variant=inset]:shadow-sm",
          "transition-all duration-300",
          className
        )}
        {...props}
      />
    )
  })
  SidebarInset.displayName = "SidebarInset"

  const SidebarInput = React.forwardRef<
    React.ElementRef<typeof Input>,
    React.ComponentProps<typeof Input>
  >(({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "h-9 w-full bg-background/80 shadow-sm focus-visible:ring-2 focus-visible:ring-sidebar-ring border-sidebar-border/50",
          "placeholder:text-sidebar-foreground/60",
          "transition-all duration-200",
          className
        )}
        {...props}
      />
    )
  })
  SidebarInput.displayName = "SidebarInput"

  const SidebarHeader = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
  >(({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={cn("flex flex-col gap-2 p-4 pb-2", className)}
        {...props}
      />
    )
  })
  SidebarHeader.displayName = "SidebarHeader"

  const SidebarFooter = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
  >(({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="footer"
        className={cn("flex flex-col gap-2 p-4 pt-2", className)}
        {...props}
      />
    )
  })
  SidebarFooter.displayName = "SidebarFooter"

  const SidebarSeparator = React.forwardRef<
    React.ElementRef<typeof Separator>,
    React.ComponentProps<typeof Separator>
  >(({ className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        data-sidebar="separator"
        className={cn("mx-4 w-auto bg-sidebar-border/50", className)}
        {...props}
      />
    )
  })
  SidebarSeparator.displayName = "SidebarSeparator"

  const SidebarContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
  >(({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="content"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto py-2",
          "group-data-[collapsible=icon]:overflow-hidden",
          // Better mobile scrolling
          "scrollbar-thin scrollbar-thumb-sidebar-border/50 scrollbar-track-transparent",
          "overscroll-contain", // Prevent scroll bounce on mobile
          className
        )}
        {...props}
      />
    )
  })
  SidebarContent.displayName = "SidebarContent"

  const SidebarGroup = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
  >(({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="group"
        className={cn("relative flex w-full min-w-0 flex-col p-3", className)}
        {...props}
      />
    )
  })
  SidebarGroup.displayName = "SidebarGroup"

  const SidebarGroupLabel = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & { asChild?: boolean }
  >(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    return (
      <Comp
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          "duration-300 flex h-8 shrink-0 items-center rounded-md px-3 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-in-out focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          "tracking-wide uppercase text-xs font-semibold",
          className
        )}
        {...props}
      />
    )
  })
  SidebarGroupLabel.displayName = "SidebarGroupLabel"

  const SidebarGroupAction = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & { asChild?: boolean }
  >(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-sidebar="group-action"
        className={cn(
          "absolute right-3 top-3.5 flex aspect-square w-6 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          "hover:scale-105 active:scale-95",
          className
        )}
        {...props}
      />
    )
  })
  SidebarGroupAction.displayName = "SidebarGroupAction"

  const SidebarGroupContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  ))
  SidebarGroupContent.displayName = "SidebarGroupContent"

  const SidebarMenu = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
  >(({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  ))
  SidebarMenu.displayName = "SidebarMenu"

  const SidebarMenuItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
  >(({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  ))
  SidebarMenuItem.displayName = "SidebarMenuItem"

  const sidebarMenuButtonVariants = cva(
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0 group-data-[collapsible=icon]:[&>svg]:size-5 group-data-[collapsible=icon]:[&>svg]:text-current",
    {
      variants: {
        variant: {
          default: "hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
          outline:
            "bg-background/80 shadow-sm hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:shadow",
        },
        size: {
          default: "h-10 text-sm md:h-9", // Larger touch target on mobile
          sm: "h-9 text-xs md:h-8",
          lg: "h-11 text-sm group-data-[collapsible=icon]:!p-0",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
  )

  const SidebarMenuButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & {
      asChild?: boolean
      isActive?: boolean
      tooltip?: string | React.ComponentProps<typeof TooltipContent>
      iconColor?: string
    } & VariantProps<typeof sidebarMenuButtonVariants>
  >(
    (
      {
        asChild = false,
        isActive = false,
        variant = "default",
        size = "default",
        tooltip,
        iconColor,
        className,
        ...props
      },
      ref
    ) => {
      const Comp = asChild ? Slot : "button"
      const { isMobile, state } = useSidebar()

      const button = (
        <Comp
          ref={ref}
          data-sidebar="menu-button"
          data-size={size}
          data-active={isActive}
          className={cn(
            sidebarMenuButtonVariants({ variant, size }),
            iconColor && state === "collapsed" && ICON_COLORS[iconColor as keyof typeof ICON_COLORS],
            state === "collapsed" && "hover:bg-sidebar-accent/60",
            className
          )}
          {...props}
        />
      )

      if (!tooltip) {
        return button
      }

      if (typeof tooltip === "string") {
        tooltip = {
          children: tooltip,
        }
      }

      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            hidden={state !== "collapsed" || isMobile}
            className="bg-sidebar text-sidebar-foreground border border-sidebar-border/50 shadow-lg"
            {...tooltip}
          />
        </Tooltip>
      )
    }
  )
  SidebarMenuButton.displayName = "SidebarMenuButton"

  const SidebarMenuAction = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & {
      asChild?: boolean
      showOnHover?: boolean
    }
  >(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-action"
        className={cn(
          "absolute right-1.5 top-1.5 flex aspect-square w-6 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "peer-data-[size=sm]/menu-button:top-1",
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "group-data-[collapsible=icon]:hidden",
          showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
          "hover:scale-110 active:scale-95",
          className
        )}
        {...props}
      />
    )
  })
  SidebarMenuAction.displayName = "SidebarMenuAction"

  const SidebarMenuBadge = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "absolute right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        "bg-sidebar-accent/20 text-sidebar-accent-foreground/80",
        className
      )}
      {...props}
    />
  ))
  SidebarMenuBadge.displayName = "SidebarMenuBadge"

  const SidebarMenuSkeleton = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
      showIcon?: boolean
    }
  >(({ className, showIcon = false, ...props }, ref) => {
    // Random width between 50 to 90%.
    const width = React.useMemo(() => {
      return `${Math.floor(Math.random() * 40) + 50}%`
    }, [])

    return (
      <div
        ref={ref}
        data-sidebar="menu-skeleton"
        className={cn("rounded-lg h-9 flex gap-2 px-2 items-center", className)}
        {...props}
      >
        {showIcon && (
          <Skeleton
            className="size-4.5 rounded-md"
            data-sidebar="menu-skeleton-icon"
          />
        )}
        <Skeleton
          className="h-4 flex-1 max-w-[--skeleton-width] rounded-md"
          data-sidebar="menu-skeleton-text"
          style={
            {
              "--skeleton-width": width,
            } as React.CSSProperties
          }
        />
      </div>
    )
  })
  SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

  const SidebarMenuSub = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
  >(({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border/30 px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  ))
  SidebarMenuSub.displayName = "SidebarMenuSub"

  const SidebarMenuSubItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
  >(({ ...props }, ref) => <li ref={ref} {...props} />)
  SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

  const SidebarMenuSubButton = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<"a"> & {
      asChild?: boolean
      size?: "sm" | "md"
      isActive?: boolean
    }
  >(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          "flex h-8 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent/50 active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          "data-[active=true]:bg-sidebar-accent/50 data-[active=true]:text-sidebar-accent-foreground",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          "group-data-[collapsible=icon]:hidden",
          "transition-colors duration-150",
          className
        )}
        {...props}
      />
    )
  })
  SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

  export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
    ICON_COLORS,
  }