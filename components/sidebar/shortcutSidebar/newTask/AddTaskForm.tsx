"use client";

import { LoadingState } from "@/components/loader/loadingState";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  projectSchema,
  ProjectSchema,
  ApiProjectSchema,
} from "@/schema/projectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useWorkspaceID } from "@/hooks/use-workspaceID";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiTaskSchema, TaskSchema, taskSchema } from "@/schema/taskSchema";
import { Check, icons } from "lucide-react";
import { Project, Task } from "@prisma/client";
import { getProjects } from "@/lib/api";
import { ProjectAvatar } from "../../optionsSidebar/project/project-avatar";
import { useRouter } from "@/i18n/routing";

interface Props {
  onSetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddTaskForm = ({ onSetOpen }: Props) => {
  const router = useRouter();
  const workspaceID = useWorkspaceID();
  const [projects, setProjects] = useState<Project[]>([]); 
  const [loading, setLoading] = useState(true);
  const t = useTranslations("AUTH.NEW_TASK");
  const m = useTranslations("MESSAGES");
  const { toast } = useToast();
  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      projectId: "",
    },
  });

  useEffect(() => {
    if (workspaceID) {
      setLoading(true);
      getProjects(workspaceID)
        .then((data) => {
          setProjects(data);
        })
        .catch((err) => {
          console.error("Failed to fetch projects:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [workspaceID]);


  console.log('task projects',projects)

  const { mutate: newTask, isPending } = useMutation({
    mutationFn: async (data: ApiTaskSchema) => {
      const { data: result } = await axios.post("/api/task/new", data);
      return result;
    },

    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : "ERRORS.DEFAULT";

      toast({
        title: m(error),
        variant: "destructive",
      });
   
    },
    onSuccess: (data: Task) => { 
      onSetOpen(false);
      toast({
        title: m("SUCCESS.NEW_TASK"),
      });
      router.push(
        `/dashboard/workspace/${workspaceID}/tasks/task/${data.id}/edit`
      );
    },
    mutationKey: ["newTask"],
  });

  const onSubmit = async (data: TaskSchema) => {

    

    const newAddedTask = newTask({
      projectId:data.projectId,
      workspaceId:workspaceID
    });

    console.log("Form task Submitted:", newAddedTask);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md w-full space-y-8"
      >
        <div className="space-y-1.5">
        <FormField
            name='projectId'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  {t("OTHERS.INPUTS.NAME")}
                </FormLabel>
                <FormControl>
                <Select 
                 value={field.value}
                 onValueChange={(value) => field.onChange(value)}
                >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                     {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        <div className='flex items-center gap-x-2'>
                                            <ProjectAvatar
                                            className='size-6'
                                            name={project.title}
                                            />
                                            {project.title}
                                        </div>
                                    </SelectItem>
                                   ))}
                </SelectContent>
              </Select>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={isPending  || !form.formState.isValid}
          type="submit"
          className="w-full mt-10 max-w-md  font-semibold"
        >
          {isPending ? (
            <LoadingState loadingText={t("BTN_PENDING")} />
          ) : (
            t("BTN_ADD")
          )}
        </Button>
      </form>
    </Form>
  );
};

