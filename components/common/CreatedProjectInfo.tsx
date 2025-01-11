"use client";

import { MAX_USER_PROJECTS } from "@/lib/options";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  className?: string;
  createdNumber: number;
}

export const CreatedProjectInfo = ({ className, createdNumber }: Props) => {
  const t = useTranslations("COMMON");

  return (
    <p
      className={cn(
        "text-muted-foreground sm:text-sm text-xs text-center",
        className
      )}
    >
      {t("ACTIVE_PROJECT.FIRST")}{" "}
      <span className="font-bold">
        {createdNumber} {t("ACTIVE_PROJECT.SECOND")} {MAX_USER_PROJECTS}
      </span>{" "}
      {t("ACTIVE_PROJECT.THIRD")}
    </p>
  );
};
