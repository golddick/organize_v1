import { z } from "zod";

export const status = z.enum([
  "BACKLOG" ,
    "TODO" ,
    "IN_PROGRESS" ,
    "TESTING",
    "IN_REVIEW" ,
    "DONE" 
]);

export const taskSchema = z.object({
  icon: z.string().optional(),
  projectId: z.string(),
  status:status.optional(),
  workspaceId: z.string().optional(),
  position: z.string().optional(),
  title: z.string().optional(),
  date: z.any(),
  content: z.any(),
});
export const apiTaskSchema = z.object({
  projectId: z.string(),
  workspaceId: z.string(),
});

export const deleteTaskSchema = z.object({
  taskId: z.string(),
  workspaceId: z.string(),
});

export type TaskSchema = z.infer<typeof taskSchema>;
export type ApiTaskSchema = z.infer<typeof apiTaskSchema>;

