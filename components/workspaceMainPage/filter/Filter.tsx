import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";
import { CommandContainer } from "./FilterCommand/CommandContainer";

import { ClientError } from "@/components/error/ClientError";
import { useFilterByUsersAndTagsInWorkspace } from "@/context/FilterByUsersAndTagsInWorkspace";
import { useTranslations } from "next-intl";
import { LoadingState } from "@/components/loader/loadingState";

interface Props {
  sessionUserId: string;
}

export const Filter = ({ sessionUserId }: Props) => {
  const { isError, isLoading } = useFilterByUsersAndTagsInWorkspace();
  const t = useTranslations("WORKSPACE_MAIN_PAGE.FILTER");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"sm"}
          className="text-white flex gap-2 items-center rounded-lg"
        >
          <FilterIcon size={16} /> {t("FILTER_BTN")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit" align="start">
        {isLoading ? (
          <div className="h-16 flex items-center justify-center">
            <LoadingState />
          </div>
        ) : isError ? (
          <ClientError
            className="bg-popover mt-0 sm:mt-0 md:mt-0"
            message="Error getting tags"
          />
        ) : (
          <CommandContainer sessionUserId={sessionUserId} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
