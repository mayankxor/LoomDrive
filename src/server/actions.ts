"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }

  const utapiResult = await utApi.deleteFiles([
    file.url.replace("https://utfs.io/f/", ""),
  ]);

  console.log(utapiResult);

  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

  console.log(dbDeleteResult);

  const c = await cookies();

  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function createFolder(name: string, parentFolderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  if (!name || name.trim().length === 0) {
    return { error: "Folder name is required" };
  }

  // Check if parent folder exists and belongs to user
  const [parentFolder] = await db
    .select()
    .from(folders_table)
    .where(
      and(eq(folders_table.id, parentFolderId), eq(folders_table.ownerId, session.userId))
    );

  if (!parentFolder) {
    return { error: "Parent folder not found" };
  }

  try {
    const result = await db
      .insert(folders_table)
      .values({
        name: name.trim(),
        parent: parentFolderId,
        ownerId: session.userId,
      })
      .$returningId();

    // Force refresh the page
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true, folderId: result[0]?.id };
  } catch (error) {
    console.error("Error creating folder:", error);
    return { error: "Failed to create folder" };
  }
}

async function getAllChildrenRecursive(folderId: number, userId: string): Promise<{
  folders: number[];
  files: { id: number; url: string }[];
}> {
  const result = {
    folders: [] as number[],
    files: [] as { id: number; url: string }[],
  };

  // Get direct child folders
  const childFolders = await db
    .select()
    .from(folders_table)
    .where(
      and(eq(folders_table.parent, folderId), eq(folders_table.ownerId, userId))
    );

  // Get direct child files
  const childFiles = await db
    .select({ id: files_table.id, url: files_table.url })
    .from(files_table)
    .where(
      and(eq(files_table.parent, folderId), eq(files_table.ownerId, userId))
    );

  console.log(`Folder ${folderId}: Found ${childFiles.length} direct files and ${childFolders.length} direct child folders`);
  
  result.files.push(...childFiles);

  // Recursively get children of child folders
  for (const folder of childFolders) {
    result.folders.push(folder.id);
    const childrenResult = await getAllChildrenRecursive(folder.id, userId);
    result.folders.push(...childrenResult.folders);
    result.files.push(...childrenResult.files);
  }

  return result;
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  // Check if the folder exists and belongs to the user
  const [folder] = await db
    .select()
    .from(folders_table)
    .where(
      and(eq(folders_table.id, folderId), eq(folders_table.ownerId, session.userId))
    );

  if (!folder) {
    return { error: "Folder not found" };
  }

  try {
    // Get all children recursively
    const children = await getAllChildrenRecursive(folderId, session.userId);

    console.log(`Deleting folder ${folderId}: Found ${children.files.length} files and ${children.folders.length} child folders`);

    // Delete all files from uploadthing
    if (children.files.length > 0) {
      const fileKeys = children.files.map(file => {
        // Handle different URL formats
        const url = file.url;
        if (url.includes('/f/')) {
          return url.substring(url.lastIndexOf('/f/') + 3);
        }
        return url;
      });
      
      console.log(`Deleting ${fileKeys.length} files from uploadthing:`, fileKeys);
      
      try {
        const utapiResult = await utApi.deleteFiles(fileKeys);
        console.log("Uploadthing deletion result:", utapiResult);
      } catch (utError) {
        console.error("Error deleting files from uploadthing:", utError);
        // Continue with database deletion even if uploadthing fails
        // This prevents orphaned database records
      }
    }

    // Delete all files from database
    for (const file of children.files) {
      await db.delete(files_table).where(eq(files_table.id, file.id));
    }

    // Delete all child folders from database
    for (const childFolderId of children.folders) {
      await db.delete(folders_table).where(eq(folders_table.id, childFolderId));
    }

    // Finally, delete the target folder itself
    await db.delete(folders_table).where(eq(folders_table.id, folderId));

    // Force refresh the page
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    console.log(`Successfully deleted folder ${folderId} and all its contents`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting folder:", error);
    return { error: "Failed to delete folder" };
  }
}
