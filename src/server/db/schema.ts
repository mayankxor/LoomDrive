import { int, text, singlestoreTable, index } from "drizzle-orm/singlestore-core";

export const files = singlestoreTable("files_table", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  size: int("size").notNull(),
  url: text("url").notNull(),
  parent: int("parent").notNull(),
}, (t) => {
  return [index("parent_index").on(t.parent)];
})

export const folders = singlestoreTable("folders_table", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  parent: int("parent"),
}, (t) => {
  return [index("parent_index").on(t.parent)];
})
