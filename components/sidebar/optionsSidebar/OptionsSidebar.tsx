"use client";

import { Settings } from "./settingsOptions/Settings";
import { CreatedWorkspacesInfo } from "@/components/common/CreatedWorkspacesInfo";
import { Workspace } from "@prisma/client";
import { WorkspaceOptions } from "./workspaceOptions/WorkspaceOptions";
import { PomodoroLinks } from "./pomodoro/PomodoroLinks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssignedToMeFilter } from "./assignedToMeFilter/AssignedToMeFilter";
import { usePathname } from "@/i18n/routing";
import { Calls } from "./calls/Calls";

interface Props {
  createdWorkspaces: number;
  userID:string
  userAdminWorkspaces: Workspace[];
  userWorkspaces: Workspace[];
}

export const OptionsSidebar = ({
  createdWorkspaces,
  userAdminWorkspaces,
  userWorkspaces,
  userID
}: Props) => {
  const pathname = usePathname();
  if (pathname === "/dashboard") return null;

  const urlWorkspaceId: string | undefined = pathname.split("/")[3];
  const urlAdditionalId: string | undefined = pathname.split("/")[6];
  const chatId: string | undefined = pathname.split("/")[5];
  const projectId: string | undefined = pathname.split("/")[5];
  const workspaceId = urlWorkspaceId ? urlWorkspaceId : "";

  if (
    pathname === "/dashboard" ||
    pathname === "/dashboard/starred" ||
    pathname === "/dashboard/calendar" ||
    (urlAdditionalId &&
      pathname ===
        `/dashboard/workspace/${workspaceId}/tasks/task/${urlAdditionalId}/edit`) ||
    (urlAdditionalId &&
      pathname ===
        `/dashboard/workspace/${workspaceId}/mind-maps/mind-map/${urlAdditionalId}/edit`)
  ) {
    return null;
  }
  return (
    <div className="border-r sm:w-64 w-52 h-full p-4 sm:py-6 flex flex-col justify-between">
      <ScrollArea className="h-full">
        {pathname.includes("/dashboard/settings") && (
          <Settings userAdminWorkspaces={userAdminWorkspaces} />
        )}
        {pathname.includes("/dashboard/calls") && (
          <Calls/>
        )}
        {/* {pathname.includes(`/dashboard/workspace/${workspaceId}`) && (
           <WorkspaceOptions workspaceId={workspaceId} /> 
        )} */}
        {(pathname === `/dashboard/workspace/${workspaceId}` ||
          pathname ===
            `/dashboard/workspace/${workspaceId}/tasks/task/${urlAdditionalId}` ||
          pathname ===
            `/dashboard/workspace/${workspaceId}/mind-maps/mind-map/${urlAdditionalId}` ||
          pathname ===
            `/dashboard/workspace/${workspaceId}/project/${projectId}` ||
          pathname ===
            `/dashboard/workspace/${workspaceId}/chat/${chatId}`) && (
          <WorkspaceOptions workspaceId={workspaceId}  projectId="" /> 
        )}

        {(pathname === "/dashboard/pomodoro" ||
          pathname === "/dashboard/pomodoro/settings") && <PomodoroLinks />}

        {pathname === "/dashboard/assigned-to-me" && (
          <AssignedToMeFilter userWorkspaces={userWorkspaces} />
        )}
      </ScrollArea>
      <CreatedWorkspacesInfo createdNumber={createdWorkspaces} />
    </div>
  );
};



