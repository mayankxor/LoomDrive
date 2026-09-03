"use client"

import { Search, Upload, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DriveHeader({
  query,
  onQueryChange,
  onUpload,
  view,
  onViewChange,
}: {
  query: string
  onQueryChange: (value: string) => void
  onUpload: () => void
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}) {
  return (
    <header className="flex items-center gap-4 px-4 py-3">
      <div className="flex shrink-0 items-center">
        <span className="text-xl tracking-tight text-foreground">LoomDrive</span>
      </div>

      <div className="relative mx-auto w-full max-w-2xl">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search in Drive"
          aria-label="Search in Drive"
          className="h-11 w-full rounded-full bg-muted pl-12 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:bg-card focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center rounded-full border border-border p-0.5">
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={cn(
              "grid size-8 place-items-center rounded-full transition-colors",
              view === "list" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted",
            )}
            aria-label="List view"
            aria-pressed={view === "list"}
          >
            <List size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={cn(
              "grid size-8 place-items-center rounded-full transition-colors",
              view === "grid" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted",
            )}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
          >
            <LayoutGrid size={18} aria-hidden="true" />
          </button>
        </div>
        <Button onClick={onUpload} className="gap-2 rounded-full">
          <Upload size={18} aria-hidden="true" />
          Upload
        </Button>
      </div>
    </header>
  )
}
