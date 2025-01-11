"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Warning from "@/components/ui/warning";
import {  AddTaskForm } from "./AddTaskForm";
import { CreatedProjectInfo } from "@/components/common/CreatedProjectInfo";

interface Props {
  createdProjects?: number;
}

export const ShortCutNewTask = ({ createdProjects }: Props) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("SIDEBAR");
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <HoverCard openDelay={250} closeDelay={250}>
          <DialogTrigger asChild>
            <HoverCardTrigger>
              <Button
                onClick={() => setOpen(true)}
                variant={"ghost"}
                // className="w-full items-start justify-start flex"
                size={"icon"} 
              >
                <Plus />
              </Button> 
            </HoverCardTrigger>
          </DialogTrigger> 
          <HoverCardContent align="start">
            {t("MAIN.OTHERS.TASK.NEW_TASK_HOVER")}
          </HoverCardContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("MAIN.OTHERS.TASK.NEW_TASK_DIALOG_TITLE")}</DialogTitle>
              <DialogDescription>
                {t("MAIN.OTHERS.TASK.NEW_TASK_DIALOG_DESC")}
              </DialogDescription>
            </DialogHeader>
            <AddTaskForm onSetOpen={setOpen} />
          </DialogContent>
        </HoverCard>
      </Dialog>
    </div>
  );
};
