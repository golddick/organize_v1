import React from 'react'


import {MoreHorizontal, Dot } from 'lucide-react'
import { TaskDateOnly } from './TaskDateOnly'
import { TaskType } from '@/types/extended'
import { DottedSeparator } from '@/components/dotted-separator'
import { ProjectAvatar } from '@/components/sidebar/optionsSidebar/project/project-avatar'
import { ReadTaskOnlyCalendar } from '../../readOnly/ReadTaskOnlyCalendar'
import { TaskOptions } from '../tableView/TaskOptions'
import { useWorkspaceID } from '@/hooks/use-workspaceID'

interface KanbanCardProps {
    task: TaskType
    userID:string
}

export const KanbanCard = ({task, userID}: KanbanCardProps) => {

    const taskID = task.id
    const workspaceID = useWorkspaceID()

  return (
    <div className='bg-white p-2 mb-1.5 rounded shadow-sm space-y-2'> 

            <div className='flex w-full items-center justify-between'>

            <div className='flex items-center gap-x-1.5 overflow-scroll truncate '>
                    <ProjectAvatar
                    name={task.title}
                    fallbackClassName='text-[10px]'
                    />
                    <span className=' text-xs font-medium text-black truncate'>{task.title}</span>
            
                </div>

            <TaskOptions
                taskId={taskID}
                workspaceId={workspaceID}
                userId={userID}
                />
            </div>
        
        <DottedSeparator color='gold'/>
        
        <div  className='flex items-center gap-x-1'>
            <ProjectAvatar
            name={task.project.title}
            fallbackClassName='text-[10px] bg-black text-gold'
            />
            <ReadTaskOnlyCalendar 
            userId={task.creator.id} // Pass userId here
          />
        </div>
    </div>
  )
}
