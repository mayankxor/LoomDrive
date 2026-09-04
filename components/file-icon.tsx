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
import type { File as DriveFile, Folder as DriveFolder } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function FileIcon({
  item,
  size = 20,
  className,
}: {
  item: DriveFile | DriveFolder
  size?: number
  className?: string
}) {
  if (item.type === "folder") {
    return (
      <Folder
        size={size}
        className={cn("text-muted-foreground", className)}
        aria-hidden="true"
      />
    )
  }

  const extension = item.name.split(".").pop()?.toLowerCase()

  const Icon =
    extension === "pdf"
      ? FileType2
      : extension === "doc" || extension === "docx"
        ? FileText
        : extension === "xls" || extension === "xlsx" || extension === "csv"
          ? Sheet
          : extension === "ppt" || extension === "pptx"
            ? Presentation
            : ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension ?? "")
              ? ImageIcon
              : ["mp4", "webm", "mov", "avi"].includes(extension ?? "")
                ? Film
                : ["mp3", "wav", "ogg", "flac"].includes(extension ?? "")
                  ? Music
                  : File

  return (
    <Icon
      size={size}
      className={cn("text-muted-foreground", className)}
      aria-hidden="true"
    />
  )
}
