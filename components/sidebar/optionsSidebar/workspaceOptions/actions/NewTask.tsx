"use client";

import { LoadingState } from "@/components/loader/loadingState";
import { Button } from "@/components/ui/button";

import { useNewTask } from "@/hooks/useNewTask";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  workspaceId: string;
  projectId: string;
}

export const NewTask = ({ workspaceId, projectId }: Props) => {
  const t = useTranslations("SIDEBAR.WORKSPACE_OPTIONS");

  const { newTask, isPending } = useNewTask(workspaceId, projectId);
  return (
    <Button
      disabled={isPending}
      onClick={() => {
        newTask();
      }}
      className="justify-start items-center gap-2"
      variant="ghost"
      size="sm"
    >
      <Plus size={16} />
      {isPending ? <LoadingState /> : t("ADD_TASK")}
    </Button>
  );
};
