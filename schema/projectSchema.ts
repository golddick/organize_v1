


import { z } from "zod";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "./imageSchema";



const projectName = z
  .string()
  .min(2, "SCHEMA.WORKSPACE.SHORT")
  .max(20, "SCHEMA.WORKSPACE.LONG")


export const projectSchema = z.object({
  projectName,
  workspaceID: z.string().optional()
});

export const apiProjectSchema = z.object({
  projectName,
    workspaceID: z.string()
});




export const projectEditData = z.object({ projectName });

export const apiProjectEditData = z.object({
  id: z.string(),
  projectName,
});

export const id = z.string();

export const apiProjectDelete = z.object({
  id,
  projectName,
}); 

export type ApiProjectDelete = z.infer<typeof apiProjectDelete>;

export type ProjectEditData = z.infer<typeof projectEditData>;
export type ApiProjectEditData = z.infer<typeof apiProjectEditData>;


export type ApiProjectSchema = z.infer<typeof apiProjectSchema>;

export type ProjectSchema = z.infer<typeof projectSchema>;
