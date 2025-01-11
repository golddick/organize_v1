"use client";

import { LoadingState } from "@/components/loader/loadingState";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Warning from "@/components/ui/warning";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { getTask, getUserWorkspaceRole, getWorkspace } from "@/lib/api";
import NotFound from "@/not-found";
import { Task, UserPermission, Workspace } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { MoreHorizontal, Pencil, Star, StarOff, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Props {
  taskId: string;
  workspaceId: string;
  userId: string;
}

export const TaskOptions = ({
  userId,
  taskId,
  workspaceId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace>();
  const [userRole, setUserRole] = useState<UserPermission>();
  const [task, setTask] = useState<Task>();
  const [isSavedByUser, setIsSavedByUser] = useState(false);

  const m = useTranslations("MESSAGES");
  const t = useTranslations("TASK.EDITOR.READ_ONLY");
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedWorkspace, fetchedUserRole, fetchedTask] = await Promise.all([
          getWorkspace(workspaceId, userId),
          getUserWorkspaceRole(workspaceId, userId),
          getTask(taskId, userId),
        ]);

        if (!fetchedWorkspace || !fetchedUserRole || !fetchedTask) {
          return NotFound();
        }

        setWorkspace(fetchedWorkspace);
        setUserRole(fetchedUserRole);
        setTask(fetchedTask);

        const savedByUser =
          fetchedTask.savedTask?.find((task) => task.userId === userId) !==
          undefined;
        setIsSavedByUser(savedByUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [taskId, workspaceId, userId]);

  const onSetIsSaved = () => {
    setIsSavedByUser((prev) => !prev);
  };

  const { mutate: deleteTask, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post("/api/task/delete", {
        workspaceId,
        taskId,
      });
    },
    onSuccess: () => {
      toast({
        title: m("SUCCESS.TASK_DELETED"),
      });

      queryClient.invalidateQueries(["getWorkspaceShortcuts"] as any);

      router.push(`/dashboard/workspace/${workspaceId}`);
      router.refresh();
    },
    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : "ERRORS.DEFAULT";

      toast({
        title: m(error),
        variant: "destructive",
      });
    },
    mutationKey: ["deleteTask"],
  });

  const { mutate: toggleSaveTask } = useMutation({
    mutationFn: async () => {
      await axios.post("/api/saved/tasks/toggleTask", {
        taskId,
      });
    },
    onMutate: () => {
      onSetIsSaved();
    },
    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : "ERRORS.DEFAULT";

      onSetIsSaved();

      toast({
        title: m(error),
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
    },
    mutationKey: ["toggleSaveTask"],
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="text-primary hover:text-primary"
            variant={"ghost"}
            size={"icon"}
          >
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent align="end" sideOffset={-8}>
            <DropdownMenuItem
              onClick={() => {
                toggleSaveTask();
              }}
            >
              {isSavedByUser ? (
                <>
                  <StarOff size={16} className="mr-2" />
                  {t("REMOVE_FROM_FAV")}
                </>
              ) : (
                <>
                  <Star size={16} className="mr-2" />
                  {t("ADD_TO_FAV")}
                </>
              )}
            </DropdownMenuItem>
            {userRole && userRole !== "READ_ONLY" && (
              <>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link
                    href={`/dashboard/workspace/${workspaceId}/tasks/task/${taskId}/edit`}
                  >
                    <Pencil size={16} className="mr-2" />
                    {t("EDIT")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger className="w-full">
                  <DropdownMenuItem className="cursor-pointer">
                    <Trash size={16} className="mr-2" />
                    {t("DELETE")}
                  </DropdownMenuItem>
                </DialogTrigger>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("DIALOG.TITLE")}</DialogTitle>
          </DialogHeader>
          <Warning>
            <p>{t("DIALOG.DESC")}</p>
          </Warning>

          <Button
            size={"lg"}
            variant={"destructive"}
            onClick={() => {
              deleteTask();
            }}
          >
            {isPending ? (
              <LoadingState loadingText={t("DIALOG.BTN_PENDING")} />
            ) : (
              t("DIALOG.BTN_DELETE")
            )}
          </Button>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

