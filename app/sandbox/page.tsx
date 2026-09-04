import { db } from "~/server/db"
import { mockFolders, mockFiles } from "~/lib/mock-data"

export default function SandboxPage() {
  return (
    <div className="flex flex-col gap-4">
      Seed function
      <form>
        <button type="submit">Seed</button>
      </form>
    </div>
  )
}
