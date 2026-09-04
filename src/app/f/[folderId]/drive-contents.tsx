"use client";

import { Upload, ChevronRight, FolderPlus } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { Button } from "~/components/ui/button";
import { createFolder } from "~/server/actions";
import { useState } from "react";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];

  currentFolderId: number;
}) {
  const navigate = useRouter();
  const posthog = usePostHog();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    setIsCreatingFolder(true);
    const result = await createFolder(newFolderName, props.currentFolderId);
    
    if (result.success) {
      setNewFolderName("");
      navigate.refresh();
    } else {
      console.error("Failed to create folder:", result.error);
      // You could add a toast notification here
    }
    
    setIsCreatingFolder(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateFolder();
    } else if (e.key === "Escape") {
      setNewFolderName("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/f/1" className="mr-2 text-gray-300 hover:text-white">
              My Drive
            </Link>
            {props.parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        
        {/* Create Folder Section */}
        <div className="mb-4 flex items-center gap-3">
          <Button
            onClick={() => setNewFolderName("New Folder")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <FolderPlus size={16} />
            Create Folder
          </Button>
          
          {newFolderName && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="rounded border border-gray-600 bg-gray-700 px-3 py-1 text-gray-100 focus:border-blue-500 focus:outline-none"
                placeholder="Folder name"
                autoFocus
                disabled={isCreatingFolder}
                onFocus={(e) => e.target.select()}
              />
              <Button
                onClick={handleCreateFolder}
                disabled={isCreatingFolder || !newFolderName.trim()}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingFolder ? "Creating..." : "Create"}
              </Button>
              <Button
                onClick={() => setNewFolderName("")}
                disabled={isCreatingFolder}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
        
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
        <UploadButton
          endpoint="driveUploader"
          onBeforeUploadBegin={(files) => {
            posthog.capture("files_uploading", {
              fileCount: files.length,
            });

            return files;
          }}
          onClientUploadComplete={() => {
            navigate.refresh();
          }}
          input={{
            folderId: props.currentFolderId,
          }}
        />
      </div>
    </div>
  );
}
