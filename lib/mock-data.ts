export type DriveItemType = "folder" | "file"

export type FileKind = "document" | "spreadsheet" | "presentation" | "image" | "pdf" | "video" | "audio"

export interface DriveItem {
  id: string
  name: string
  type: DriveItemType
  /** Only for files */
  kind?: FileKind
  /** Only for files: external link the file "opens" to */
  url?: string
  /** Only for folders */
  children?: DriveItem[]
  owner: string
  modified: string
  size?: string
}

export const driveData: DriveItem[] = [
  {
    id: "f-projects",
    name: "Projects",
    type: "folder",
    owner: "me",
    modified: "May 2, 2026",
    children: [
      {
        id: "f-2026-launch",
        name: "2026 Launch",
        type: "folder",
        owner: "me",
        modified: "Apr 28, 2026",
        children: [
          {
            id: "file-launch-plan",
            name: "Launch Plan.gdoc",
            type: "file",
            kind: "document",
            url: "https://docs.google.com/document/",
            owner: "me",
            modified: "Apr 27, 2026",
            size: "24 KB",
          },
          {
            id: "file-budget",
            name: "Budget Forecast.gsheet",
            type: "file",
            kind: "spreadsheet",
            url: "https://docs.google.com/spreadsheets/",
            owner: "Priya Nair",
            modified: "Apr 25, 2026",
            size: "88 KB",
          },
          {
            id: "file-keynote",
            name: "Keynote Deck.gslides",
            type: "file",
            kind: "presentation",
            url: "https://docs.google.com/presentation/",
            owner: "me",
            modified: "Apr 20, 2026",
            size: "4.2 MB",
          },
        ],
      },
      {
        id: "file-roadmap",
        name: "Roadmap.gdoc",
        type: "file",
        kind: "document",
        url: "https://docs.google.com/document/",
        owner: "me",
        modified: "May 1, 2026",
        size: "31 KB",
      },
      {
        id: "file-timeline",
        name: "Timeline.gsheet",
        type: "file",
        kind: "spreadsheet",
        url: "https://docs.google.com/spreadsheets/",
        owner: "Diego Alvarez",
        modified: "Apr 30, 2026",
        size: "52 KB",
      },
    ],
  },
  {
    id: "f-design",
    name: "Design Assets",
    type: "folder",
    owner: "me",
    modified: "Apr 18, 2026",
    children: [
      {
        id: "file-logo",
        name: "Logo Final.png",
        type: "file",
        kind: "image",
        url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
        owner: "me",
        modified: "Apr 16, 2026",
        size: "1.1 MB",
      },
      {
        id: "file-mockups",
        name: "App Mockups.pdf",
        type: "file",
        kind: "pdf",
        url: "https://www.orimi.com/pdf-test.pdf",
        owner: "Sara Kim",
        modified: "Apr 12, 2026",
        size: "6.8 MB",
      },
      {
        id: "file-hero",
        name: "Hero Photo.jpg",
        type: "file",
        kind: "image",
        url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174",
        owner: "me",
        modified: "Apr 10, 2026",
        size: "3.4 MB",
      },
    ],
  },
  {
    id: "f-personal",
    name: "Personal",
    type: "folder",
    owner: "me",
    modified: "Mar 30, 2026",
    children: [
      {
        id: "file-taxes",
        name: "Taxes 2025.pdf",
        type: "file",
        kind: "pdf",
        url: "https://www.orimi.com/pdf-test.pdf",
        owner: "me",
        modified: "Mar 28, 2026",
        size: "920 KB",
      },
      {
        id: "file-trip",
        name: "Trip Recap.mp4",
        type: "file",
        kind: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        owner: "me",
        modified: "Mar 22, 2026",
        size: "48 MB",
      },
    ],
  },
  {
    id: "file-notes",
    name: "Meeting Notes.gdoc",
    type: "file",
    kind: "document",
    url: "https://docs.google.com/document/",
    owner: "me",
    modified: "May 2, 2026",
    size: "18 KB",
  },
  {
    id: "file-invoice",
    name: "Invoice Q2.gsheet",
    type: "file",
    kind: "spreadsheet",
    url: "https://docs.google.com/spreadsheets/",
    owner: "Priya Nair",
    modified: "May 1, 2026",
    size: "40 KB",
  },
  {
    id: "file-demo-audio",
    name: "Podcast Draft.mp3",
    type: "file",
    kind: "audio",
    url: "https://www.w3schools.com/html/horse.mp3",
    owner: "me",
    modified: "Apr 29, 2026",
    size: "12 MB",
  },
  {
    id: "file-brand-photo",
    name: "Brand Shoot.jpg",
    type: "file",
    kind: "image",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    owner: "Sara Kim",
    modified: "Apr 27, 2026",
    size: "5.2 MB",
  },
]
