"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Moon, Sun, Monitor } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault()
        const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
        setTheme(nextTheme)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [theme, setTheme])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <div className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors">
          {theme === "light" ? (
            <Sun className="h-4 w-4" />
          ) : theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Monitor className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover border">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={cn(
            "cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
            theme === "light" && "bg-accent text-accent-foreground"
          )}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span className="flex-1">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={cn(
            "cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
            theme === "dark" && "bg-accent text-accent-foreground"
          )}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span className="flex-1">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={cn(
            "cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
            theme === "system" && "bg-accent text-accent-foreground"
          )}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span className="flex-1">System</span>
        </DropdownMenuItem>
        <div className="px-2 py-1.5 text-xs text-muted-foreground border-t">
          Ctrl+Shift+T to toggle
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
