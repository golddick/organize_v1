"use client";

import { useGetAssignedToMeParams } from "@/hooks/useGetAssignedToMeParams";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { AssignedToMeItem } from "./AssignedToMeItem";
import { AssignedToMeDataItem } from "@/types/extended";
import { LoadingScreen } from "../common/LoadingScreen";
import { ClientError } from "../error/ClientError";
import { useTranslations } from "next-intl";

interface Props {
  userId: string;
}

export const AssignedToMeContainer = ({ userId }: Props) => {
  const { currentType, workspaceFilterParam } = useGetAssignedToMeParams();
  const m = useTranslations("MESSAGES");
  const t = useTranslations("ASSIGNED_TO_ME");

  const {
    data: assignedInfo,
    isLoading,
    isError,
    error,
  } = useQuery<AssignedToMeDataItem[], Error>({
    queryFn: async () => {
      const res = await fetch(
        `/api/assigned_to/get?workspace=${workspaceFilterParam}&type=${currentType}&userId=${userId}`
      );

      if (!res.ok) {
        const error = (await res.json()) as string;
        throw new Error(error);
      }

      const data = await res.json();
      return data;
    },
    queryKey: [
      "getAssignedToMeInfo",
      userId,
      workspaceFilterParam,
      currentType,
    ],
  });

  if (isLoading) return <LoadingScreen />;

  if (isError) {
    return (
      <ClientError
        message={m(error.message)}
        hrefToGoOnReset="/dashboard/assigned-to-me?workspace=all&type=all"
      />
    );
  }

  return (
    <Card className="bg-background border-none shadow-none">
      <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col space-y-1.5 mb-4 sm:mb-0">
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            {t("TITLE")}
          </h1>
          <CardDescription className="text-base">{t("DESC")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {currentType === "all" &&
        workspaceFilterParam === "all" &&
        assignedInfo?.length === 0 ? (
          <p>{t("NO_ASSIGNMENT")}</p>
        ) : assignedInfo?.length === 0 ? (
          <p>{t("NOT_FOUND")}</p>
        ) : (
          assignedInfo?.map((info) => (
            <AssignedToMeItem info={info} key={info.id} />
          ))
        )}
      </CardContent>
    </Card>
  );
};
