import { AddTaskShortcut } from '@/components/addTaskShortCut/AddTaskShortcut';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { InviteUsers } from '@/components/inviteUsers/InviteUsers';
import { ShortCutNewTask } from '@/components/sidebar/shortcutSidebar/newTask/ShortCutNewTask';
import { TaskViewSwitcher } from '@/components/tasks/taskView/task-view-switcher';
import { FilterContainer } from '@/components/workspaceMainPage/filter/FilterContainer';
import { RecentActivityContainer } from '@/components/workspaceMainPage/recentActivity/RecentActivityContainer';
import { ShortcutContainer } from '@/components/workspaceMainPage/shortcuts/ShortcutContainer';
import { LeaveWorkspace } from '@/components/workspaceMainPage/shortcuts/leaveWorkspace/LeaveWorkspace';
import { FilterByUsersAndTagsInWorkspaceProvider } from '@/context/FilterByUsersAndTagsInWorkspace';
import { getUserWorkspaceRole, getWorkspace, getWorkspaceWithChatId } from '@/lib/api';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding';
import { notFound } from 'next/navigation';
import React from 'react'

interface Params {
    params: {
      workspace_id: string;
    };
  }
  

const page = async ({params: { workspace_id }}:Params) => {

    const session = await checkIfUserCompletedOnboarding(
        `/dashboard/workspace/${workspace_id}`
      );
    
      const [workspace, userRole] = await Promise.all([
        getWorkspaceWithChatId(workspace_id, session.user.id),
        getUserWorkspaceRole(workspace_id, session.user.id),
      ]);
    
      if (!workspace || !userRole) notFound();

      console.log('workspace on id page', workspace)
      console.log('userRole', userRole)

  return (
    <FilterByUsersAndTagsInWorkspaceProvider>
         <DashboardHeader
        addManualRoutes={[
          {
            name: "DASHBOARD",
            href: "/dashboard",
            useTranslate: true,
          },
          {
            name: workspace.name,
            href: `/dashboard/workspace/${workspace_id}`,
          },
        ]}
      >
        {(userRole === "ADMIN" || userRole === "OWNER") && (
          <InviteUsers workspace={workspace} />
        )}
        {userRole !== "OWNER" && <LeaveWorkspace workspace={workspace} />}
        {/* <AddTaskShortcut userId={session.user.id} /> */}
        <ShortCutNewTask/>
      </DashboardHeader>
        
      <main className="flex flex-col gap-2 w-full">
        <ShortcutContainer workspace={workspace} userRole={userRole} />
        {/* <FilterContainer sessionUserId={session.user.id} /> */}
        {/* <RecentActivityContainer
          userId={session.user.id}
          workspaceId={workspace.id}
        /> */}
        <TaskViewSwitcher
         userId={session.user.id}
         workspaceId={workspace.id}
        />
      </main>
    </FilterByUsersAndTagsInWorkspaceProvider>
  )
}

export default page