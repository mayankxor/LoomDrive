import {
  FileText,
  Sheet,
  Presentation,
  ImageIcon,
  FileType2,
  Film,
  Music,
  File,
  Folder,
} from "lucide-react"
import type { DriveItem, FileKind } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const kindConfig: Record<FileKind, { icon: typeof FileText; className: string }> = {
  document: { icon: FileText, className: "text-blue-600" },
  spreadsheet: { icon: Sheet, className: "text-green-600" },
  presentation: { icon: Presentation, className: "text-yellow-600" },
  image: { icon: ImageIcon, className: "text-purple-600" },
  pdf: { icon: FileType2, className: "text-red-600" },
  video: { icon: Film, className: "text-pink-600" },
  audio: { icon: Music, className: "text-orange-600" },
}

export function FileIcon({
  item,
  size = 20,
  className,
}: {
  item: DriveItem
  size?: number
  className?: string
}) {
  if (item.type === "folder") {
    return <Folder size={size} className={cn("text-muted-foreground", className)} aria-hidden="true" />
  }

  const config = item.kind ? kindConfig[item.kind] : null
  const Icon = config?.icon ?? File
  return <Icon size={size} className={cn(config?.className ?? "text-muted-foreground", className)} aria-hidden="true" />
}
