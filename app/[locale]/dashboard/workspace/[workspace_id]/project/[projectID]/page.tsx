

import { AddTaskShortcut } from '@/components/addTaskShortCut/AddTaskShortcut'
import { DashboardHeader } from '@/components/header/DashboardHeader'
import { AddNewTask } from '@/components/sidebar/shortcutSidebar/newTask/NewTask';
import { ShortCutNewTask } from '@/components/sidebar/shortcutSidebar/newTask/ShortCutNewTask';
import { TaskViewSwitcher } from '@/components/tasks/taskView/task-view-switcher';
import { checkIfUserCompletedOnboarding } from '@/lib/checkIfUserCompletedOnboarding'
import React, { useMemo } from 'react'

interface Params {
    params: {
      workspace_id: string;
      projectId: string;
    };
  }

const page = async ({params}:Params) => {
    const session = await checkIfUserCompletedOnboarding(`/dashboard/workspace/${params.workspace_id}/project/${params.projectId}`)
    const userId = session.user.id
    const workspaceId = params.workspace_id
    const projectId = params.projectId


console.log('projectId projectId',projectId)

  return (
    <>
    <DashboardHeader workspaceHref={`/dashboard/workspace`} 
      addManualRoutes={[
        {
          name: "DASHBOARD", 
          href: "/", 
          useTranslate: true, 
        },
        // You can add more route objects here if needed
        {
          name: "Project",
          href: "/",
          useTranslate: false,
        },
      ]}
    >
        <ShortCutNewTask/>
    </DashboardHeader>
    <div>
        <TaskViewSwitcher userId={userId} workspaceId={workspaceId} />
    </div>
    </>
  )
}

export default page