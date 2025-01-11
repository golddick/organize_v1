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
import { AddProjectForm } from "./AddProjectForm";
import { CreatedProjectInfo } from "@/components/common/CreatedProjectInfo";

interface Props {
  createdProjects: number;
}

export const AddProject = ({ createdProjects }: Props) => {
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
                size={"icon"} 
              >
                <Plus />
              </Button>
            </HoverCardTrigger>
          </DialogTrigger> 
          <HoverCardContent align="start">
            {t("MAIN.OTHERS.PROJECT.NEW_PROJECT_HOVER")}
          </HoverCardContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("MAIN.OTHERS.PROJECT.NEW_PROJECT_DIALOG_TITLE")}</DialogTitle>
              <DialogDescription>
                {t("MAIN.OTHERS.PROJECT.NEW_PROJECT_DIALOG_DESC")}
              </DialogDescription>
            </DialogHeader>
            <Warning className=" sm:flex" yellow>
              <CreatedProjectInfo
                className="text-left text-secondary-foreground"
                createdNumber={createdProjects}
              />
            </Warning>
            <AddProjectForm onSetOpen={setOpen} />
          </DialogContent>
        </HoverCard>
      </Dialog>
    </div>
  );
};
