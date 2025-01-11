"use client";
import { CustomColors, Tag, TaskStatus } from "@prisma/client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { taskSchema, TaskSchema } from "@/schema/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import TextareaAutosize from "react-textarea-autosize";

import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Emoji } from "@/components/tasks/editable/container/Emoji";
import { TaskCalendar } from "@/components/tasks/editable/container/TaskCalendar";

import { EditorTasks } from "../editor/Editor";
import { TagSelector } from "../../../common/tag/TagSelector";
import { LinkTag } from "../tag/LinkTag";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";
import { useAutosaveIndicator } from "@/context/AutosaveIndicator";
import axios from "axios";
import { changeCodeToEmoji } from "@/lib/changeCodeToEmoji";
import { useTags } from "@/hooks/useTags";
import { Status } from "./TaskStatus";
import { AssignedToTaskSelector } from "../../assignToTask/AssignedToTaskSelector";





interface Props {
  workspaceId: string;
  initialActiveTags: Tag[];
  taskId: string;
  status: TaskStatus;
  title?: string;
  assign?: string;
  content?: JSON;
  emoji?: string;
  from?: Date;
  to?: Date;
}

export const TaskContainer = ({
  workspaceId,
  initialActiveTags,
  taskId,
  title,
  assign,
  status: taskStatus,
  content,
  emoji,
  from,
  to,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations("TASK");
  const [taskDate] = useState({ from, to });
  const { status, onSetStatus } = useAutosaveIndicator();

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      icon: emoji,
      title: title ? title : "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { ref: titleRef, ...rest } = form.register("title");

  const onFormSelectHandler = (emoji: string) => {
    form.setValue("icon", emoji);
  };

  const onUpdateFormHandler = (date: DateRange | undefined) => {
    form.setValue("date", date);
  };
  // const onUpdateAssignHandler = (assign: DateRange | undefined) => {
  //   form.setValue("assign", assign);
  // };

  const { mutate: updateTaskTitle, isPending } = useMutation({
    mutationFn: async (title: string) => {
      await axios.post("/api/task/update/title", {
        workspaceId,
        taskId,
        title,
      });
    },
    onSuccess: () => {
      onSetStatus("saved");
    },
    onError: () => {
      onSetStatus("unsaved");
    },
  });


  const { mutate: updateTaskStatus } = useMutation({
    mutationFn: async (status: TaskStatus) => {
      await axios.post("/api/task/update/status", {
        workspaceId,
        taskId,
        taskStatus: status,
      });
    },
    onSuccess: () => {
      onSetStatus("saved");
    },
    onError: () => {
      onSetStatus("unsaved");
    },
  });

   // Debounced function to update status after a delay
   const debouncedStatus = useDebouncedCallback(
    useCallback((status: TaskStatus) => {
      onSetStatus("pending");  // Set UI status to "pending"
      updateTaskStatus(status);  // Pass the status to mutation function
    }, [updateTaskStatus]),
    2000 // Delay of 2 seconds before firing the mutation
  );

 

  const { mutate: updateTaskActiveTags } = useMutation({
    mutationFn: async (tagIds: string[]) => {
      await axios.post("/api/task/update/active_tags", {
        workspaceId,
        tagsIds: tagIds,
        taskId,
      });
    },
    onSuccess: () => {
      onSetStatus("saved");
    },
    onError: () => {
      onSetStatus("unsaved");
    },
  });

  const debouncedTitle = useDebouncedCallback(
    useCallback((value: string) => {
      onSetStatus("pending");
      updateTaskTitle(value);
    }, []),
    2000
  );
 

  const debouncedCurrentActiveTags = useDebouncedCallback(() => {
    onSetStatus("pending");
    const tagsIds = currentActiveTags.map((tag) => tag.id);
    updateTaskActiveTags(tagsIds);
  }, 2000);

  const onSubmit = (data: TaskSchema) => {
    console.log(data);
  };

  const {
    currentActiveTags,
    tags,
    isError,
    isLoadingTags,
    onDeleteActiveTagHandler,
    onSelectActiveTagHandler,
    onUpdateActiveTagHandler,
  } = useTags(
    workspaceId,
    isMounted,
    initialActiveTags,
    debouncedCurrentActiveTags
  );

  return (
    <Card>
      <form id="task-form">
        <CardContent className="py-4 sm:py-6 flex flex-col gap-10">
          <div className="w-full flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
            <Emoji
              onFormSelect={onFormSelectHandler}
              emoji={form.getValues("icon")}
              taskId={taskId}
              workspaceId={workspaceId}
            />
            {/* <div>emoji</div> */}
            <div className="w-full flex flex-col gap-2">
              <TextareaAutosize
                {...rest}
                ref={(e) => {
                  titleRef(e);
                  //@ts-ignore
                  _titleRef.current = e;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                onChange={(e) => {
                  if (status !== "unsaved") onSetStatus("unsaved");
                  debouncedTitle(e.target.value);
                }}
                placeholder={t("HEADER.PLACEHOLDER")}
                className="w-fit resize-none appearance-none overflow-hidden rounded-md bg-transparent placeholder:text-muted-foreground text-2xl font-semibold focus:outline-none"
              />
            
              <div className="w-full gap-1 flex flex-wrap flex-row items-center">
                  <Status
                  status={taskStatus}
                  onChange={(newStatus) => {
                    // If the status is not already "unsaved", set it to "unsaved"
                    if (taskStatus !== "DONE") onSetStatus("unsaved");

                    // Call the debounced function with the new status
                    debouncedStatus(newStatus);

                    console.log("newStatus ooo", newStatus);  // Log the new status for debugging
                  }}
                />
                
                <TaskCalendar
                  onUpdateForm={onUpdateFormHandler}
                  workspaceId={workspaceId}
                  taskId={taskId}
                  from={taskDate.from}
                  to={taskDate.to}
                />
                <AssignedToTaskSelector
                taskId={taskId}
                workspaceId={workspaceId}
                className="w-[180px]  h-fit text-xs justify-start text-left font-normal px-2.5 py-3"
              />
                <TagSelector
                  isError={isError}
                  isLoading={isLoadingTags}
                  tags={tags}
                  currentActiveTags={currentActiveTags}
                  onSelectActiveTag={onSelectActiveTagHandler}
                  workspaceId={workspaceId}
                  onUpdateActiveTags={onUpdateActiveTagHandler}
                  onDeleteActiveTag={onDeleteActiveTagHandler}
                />
                {currentActiveTags.map((tag) => (
                  <LinkTag key={tag.id} tag={tag} disabled />
                ))}
              </div>
            </div>
          </div>
          <EditorTasks
            workspaceId={workspaceId}
            taskId={taskId}
            content={content}
          />
        </CardContent>
      </form>
    </Card>
  );
};
