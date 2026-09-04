"use client"

import { ChevronRight, Home, MoreVertical, ExternalLink } from "lucide-react"
import type { File, Folder } from "@/lib/mock-data"
import { FileIcon } from "@/components/file-icon"
import { cn } from "@/lib/utils"

export interface Crumb {
  id: string
  name: string
}

export function DriveContent({
  items,
  crumbs,
  view,
  onViewChange,
  onOpenFolder,
  onNavigateCrumb,
}: {
  items: (File|Folder)[];
  crumbs: Crumb[];
  view: "grid" | "list";
  onViewChange: React.Dispatch<React.SetStateAction<"grid" | "list">>;
  onOpenFolder: (folder: Folder) => void;
  onNavigateCrumb: (index: number) => void;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-4 px-6 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-lg">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1
            const isRoot = index === 0
            return (
              <span key={crumb.id} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight size={18} className="text-muted-foreground" aria-hidden="true" />
                )}
                <button
                  type="button"
                  onClick={() => onNavigateCrumb(index)}
                  disabled={isLast}
                  className={cn(
                    "flex items-center gap-2 rounded px-2 py-1 transition-colors",
                    isLast
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  aria-current={isLast ? "page" : undefined}
                  aria-label={isRoot ? "Home" : undefined}
                >
                  {isRoot ? <Home size={18} aria-hidden="true" /> : crumb.name}
                </button>
              </span>
            )
          })}
        </nav>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8">
        {items.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">This folder is empty.</p>
        ) : view === "grid" ? (
          <GridView items={items} onOpenFolder={onOpenFolder} />
        ) : (
          <ListView items={items} onOpenFolder={onOpenFolder} />
        )}
      </div>
    </section>
  )
}

function GridView({
  items,
  onOpenFolder,
}: {
  items: (File|Folder)[];
  onOpenFolder: (folder: Folder) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) =>
        item.type === "folder" ? (
          <button
            key={item.id}
            type="button"
            onDoubleClick={() => onOpenFolder(item)}
            onClick={() => onOpenFolder(item)}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted"
          >
            <FileIcon item={item} size={22} />
            <span className="truncate text-sm font-medium text-foreground">{item.name}</span>
          </button>
        ) : (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2 px-3 py-3">
              <FileIcon item={item} size={20} />
              <span className="flex-1 truncate text-sm font-medium text-foreground">{item.name}</span>
              <ExternalLink
                size={15}
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
            <div className="grid h-28 place-items-center border-t border-border bg-muted/50">
              <FileIcon item={item} size={44} />
            </div>
          </a>
        ),
      )}
    </div>
  )
}

function ListView({
  items,
  onOpenFolder,
}: {
  items: (File|Folder)[];
  onOpenFolder: (folder: Folder) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[1fr_140px_120px_80px_40px] items-center gap-4 border-b border-border bg-muted/50 px-4 py-2.5 text-xs font-medium text-muted-foreground">
        <span>Name</span>
        <span className="hidden sm:block">Owner</span>
        <span className="hidden sm:block">Last modified</span>
        <span className="hidden sm:block">Size</span>
        <span className="sr-only">Actions</span>
      </div>
      <ul>
        {items.map((item) => {
          const rowClass =
            "grid grid-cols-[1fr_140px_120px_80px_40px] items-center gap-4 border-b border-border px-4 py-2.5 text-sm last:border-b-0 transition-colors hover:bg-muted"
          const content = (
            <>
              <span className="flex min-w-0 items-center gap-3">
                <FileIcon item={item} size={20} />
                <span className="truncate font-medium text-foreground">{item.name}</span>
              </span>
              <span className="hidden truncate text-muted-foreground sm:block">-</span>
              <span className="hidden truncate text-muted-foreground sm:block">-</span>
              <span className="hidden truncate text-muted-foreground sm:block">{item.type === "file" ? item.size : "-"}</span>
              <span className="grid place-items-center text-muted-foreground">
                {item.type === "folder" ? (
                  <MoreVertical size={16} aria-hidden="true" />
                ) : (
                  <ExternalLink size={16} aria-hidden="true" />
                )}
              </span>
            </>
          )

          return (
            <li key={item.id}>
              {item.type === "folder" ? (
                <button type="button" onClick={() => onOpenFolder(item)} className={cn(rowClass, "w-full text-left")}>
                  {content}
                </button>
              ) : (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
                  {content}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
