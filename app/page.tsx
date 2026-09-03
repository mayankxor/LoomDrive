"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { driveData, type DriveItem } from "@/lib/mock-data"
import { DriveHeader } from "@/components/drive-header"
import { DriveContent, type Crumb } from "@/components/drive-content"

const ROOT: Crumb = { id: "root", name: "My Drive" }

export default function Page() {
  const [path, setPath] = useState<Crumb[]>([ROOT])
  const [view, setView] = useState<"grid" | "list">("grid")
  const [query, setQuery] = useState("")
  const [upload, setUpload] = useState<"idle" | "uploading" | "done">("idle")

  // Resolve the current folder's items by walking the path from root.
  const currentItems = useMemo(() => {
    let items: DriveItem[] = driveData
    for (const crumb of path.slice(1)) {
      const folder = items.find((item) => item.id === crumb.id)
      items = folder?.children ?? []
    }
    return items
  }, [path])

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return currentItems
    return currentItems.filter((item) => item.name.toLowerCase().includes(q))
  }, [currentItems, query])

  function openFolder(folder: DriveItem) {
    setQuery("")
    setPath((prev) => [...prev, { id: folder.id, name: folder.name }])
  }

  function navigateCrumb(index: number) {
    setQuery("")
    setPath((prev) => prev.slice(0, index + 1))
  }

  function handleUpload() {
    setUpload("uploading")
    window.setTimeout(() => setUpload("done"), 1600)
    window.setTimeout(() => setUpload("idle"), 4200)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <DriveHeader
        query={query}
        onQueryChange={setQuery}
        onUpload={handleUpload}
        view={view}
        onViewChange={setView}
      />
      <div className="flex min-h-0 flex-1">
        <main className="flex min-h-0 flex-1 flex-col bg-card md:m-3 md:rounded-2xl md:border md:border-border">
          <DriveContent
            items={visibleItems}
            crumbs={path}
            view={view}
            onViewChange={setView}
            onOpenFolder={openFolder}
            onNavigateCrumb={navigateCrumb}
          />
        </main>
      </div>

      {upload !== "idle" && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 flex w-72 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lg"
        >
          {upload === "uploading" ? (
            <>
              <Loader2 size={20} className="animate-spin text-primary" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Uploading 1 item…</p>
                <p className="text-xs text-muted-foreground">Untitled document.gdoc</p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 size={20} className="text-green-600" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Upload complete</p>
                <p className="text-xs text-muted-foreground">This is a mock upload.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
