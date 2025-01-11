import { Workspace } from "@prisma/client";
import { Bottom } from "./Bottom";
import { AddWorkspace } from "./newWorkspace/AddWorkspace";
import { Top } from "./Top";
import { Workspaces } from "./workspaces/Workspaces";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddProject } from "./newProject/AddProject";

interface Props {
  userWorkspaces: Workspace[];
  createdWorkspaces: number;
  createdProjects: number;
}

export const ShortcutSidebar = ({
  userWorkspaces,
  createdWorkspaces,

}: Props) => {
  console.log('userWorkspaces',  userWorkspaces)
  return (
    <div className="border-r h-full flex flex-col justify-between items-center p-4 sm:py-6">
      <ScrollArea className="max-h-[35rem]">
        <div className="w-full space-y-3 p-1">
          <Top />
          <AddWorkspace createdWorkspaces={createdWorkspaces} />
          <Workspaces
            userWorkspaces={userWorkspaces}
            href="/dashboard/workspace"
          />
        </div>
      </ScrollArea>

      <Bottom />
    </div>
  );
};
