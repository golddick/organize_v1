"use client";

import { LinkTag } from "@/components/tasks/editable/tag/LinkTag";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ExtendedMindMap } from "@/types/extended";
import { UserPermission } from "@prisma/client";
import { Info, Star } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import React, { useState } from "react";
import { MindMapCardPreviewOptions } from "./MindMapCardPreviewOptions";
import { ReadOnlyEmoji } from "@/components/common/ReadOnlyEmoji";
import { UserHoverInfo } from "@/components/common/UserHoverInfoCard";
import { Separator } from "@/components/ui/separator";
import { AssignedToMindMapSelector } from "../assignToMindMap/AssignedToMindMapSelector";

interface Props {
  mindMap: ExtendedMindMap;
  children: React.ReactNode;
  isSavedByUser: boolean;
  userRole: UserPermission | null;
}

export const MindMapPreviewCardWrapper = ({
  mindMap,
  children,
  isSavedByUser,
  userRole,
}: Props) => {
  const [isSaved, setIsSaved] = useState(isSavedByUser);

  const t = useTranslations("MIND_MAP.PREVIEW");

  const onSetIsSaved = () => {
    setIsSaved((prev) => !prev);
  };
  const [updater] = useState(mindMap.updatedBy);
  const format = useFormatter();
  const dateTime = new Date(mindMap.createdAt);
  const now = new Date();

  return (
    <Card className="h-full">
      <CardContent className="py-4 sm:py-6 flex flex-col gap-10 relative h-full">
        <div className="w-full flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
          <ReadOnlyEmoji selectedEmoji={mindMap?.emoji} />
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center">
              <div className="w-5/6">
                <p className="text-2xl font-semibold flex items-center gap-2">
                  {mindMap.title ? mindMap.title : t("NO_TITLE")}
                  {isSaved && <Star />}
                </p>
              </div>
              <div className="absolute top-5 right-5 sm:static">
                <MindMapCardPreviewOptions
                  isSaved={isSaved}
                  mindMapId={mindMap.id}
                  workspaceId={mindMap.workspaceId}
                  onSetIsSaved={onSetIsSaved}
                  userRole={userRole}
                />
              </div>
            </div>
            <div className="w-full gap-1 flex flex-wrap flex-row items-center">
              <div className="mr-2">
                <HoverCard openDelay={250} closeDelay={250}>
                  <HoverCardTrigger>
                    <Info size={16} className="w-4 h-4" />
                  </HoverCardTrigger>
                  <HoverCardContent className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-full">
                    {t("INFO")}
                  </HoverCardContent>
                </HoverCard>
              </div>
              <AssignedToMindMapSelector
                mindMapId={mindMap.id}
                workspaceId={mindMap.workspaceId}
              />
              {mindMap.tags &&
                mindMap.tags.map((tag) => <LinkTag key={tag.id} tag={tag} />)}
            </div>
          </div>
        </div>
        <div className="h-full w-full">{children}</div>
      </CardContent>
      <CardFooter className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 text-xs mt-4 sm:mt-0">
        <div className="flex items-center">
          <p>{t("CREATOR_INFO")}</p>
          <UserHoverInfo user={mindMap.creator} />
        </div>
        <Separator className="hidden h-4 sm:block" orientation="vertical" />
        <div className="flex items-center">
          <p>{t("EDITOR_INFO")}</p>
          <UserHoverInfo user={updater} />
          <p>{format.relativeTime(dateTime, now)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};
