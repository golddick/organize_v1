'use client'

import React, {useCallback, useEffect, useMemo, useState} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Loader, PlusIcon } from 'lucide-react'
import { DottedSeparator } from '@/components/dotted-separator'
import { DataFilters } from './data-filters'
import { TableView } from './tableView/TableView'
import { useQuery } from '@tanstack/react-query'
import { useWorkspaceID } from '@/hooks/use-workspaceID'
import { Task, TaskStatus } from '@prisma/client'
import {  createColumns } from './tableView/columns'
import { DataTable } from './tableView/DataTable'
import { TaskType } from '@/types/extended'
import { useProjectID } from '@/hooks/use-projectID'
import { TaskKanban } from './kanban/task-kanban'
import { toast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { Calendar } from '@/components/calendar/Calendar'


interface TaskViewSwitcherProps {
    userId:string
    workspaceId:string

}

export const TaskViewSwitcher = ({ userId, workspaceId}:TaskViewSwitcherProps) => {
  const t = useTranslations("MESSAGES");
  const projectId = useProjectID()
 

    const { data: tasks, isLoading } = useQuery({
        queryFn: async () => {
        const res = await fetch(`/api/task/get/all?workspaceId=${workspaceId}&userId=${userId}`);

          if (!res.ok) return null;
    
          const data = await res.json();
          return data as TaskType[];
        },
        queryKey: ["getTasks", workspaceId],
      }); 

    
    const isLoadingTasks = isLoading


      // Filter tasks based on the project page context
  const filteredTasks = useMemo(() => {

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return []; // Return an empty array if tasks is not an array or is empty
    }

    if (!projectId) {
      // If not on a project page, show all tasks
      return tasks;
    }
    // Otherwise, show only tasks for the current project
    return tasks.filter((task) => task.project?.id === projectId);
  }, [tasks, projectId]);




    const updateTaskStatus = async (taskId: string, newStatus: TaskStatus, newPosition: number) => {
      try {
          const response = await fetch('/api/task/update/status/position', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  taskStatus: newStatus,
                  taskId,
                  workspaceId,
                  position: newPosition,
              }),
          });

          if (!response.ok) {
            toast({
              title: 'Task status not updated', 
            })
              throw new Error('Failed to update task status');
          }

          const updatedTask = await response.json();
          toast({
            title: 'Task status updated successfully',
          })
          console.log('Task updated successfully:', updatedTask);
      } catch (error) {
          console.error('Error updating task:', error);
      }
  };


  const onKanbanChange = useCallback(
    (updatedTasks: { $id: string; status: TaskStatus; position: number }[]) => {
        updatedTasks.forEach(({ $id, status, position }) => {
            updateTaskStatus($id, status, position); // Call the update function for each task
        });
    },
    []
);

const [defaultTab, setDefaultTab] = useState<string>('table');

useEffect(() => {
  // Logic to dynamically set the default tab based on some condition
  // For example, from URL, user settings, etc.
  const tabFromURL = window.location.hash.replace('#', ''); // Example of fetching from URL hash
  if (['table', 'calendar', 'kanban'].includes(tabFromURL)) {
    setDefaultTab(tabFromURL);
  }
}, []);

  return (
    <Tabs  defaultValue={defaultTab}  className="w-full flex-1  rounded-lg">
            <div className=' h-full flex flex-col overflow-auto p-2'>
                    <div className='flex flex-col gap-y-2 lg:flex-row justify-between items-center'>
                    <TabsList className='w-full lg:w-auto'>
                        <TabsTrigger value="table" className='h-8 w-full lg:w-auto'>Table</TabsTrigger>
                        <TabsTrigger value="kanban" className='h-8 w-full lg:w-auto'>Kanban</TabsTrigger>
                        <TabsTrigger value="calender" className='h-8 w-full lg:w-auto'>Calender</TabsTrigger>
                    </TabsList>
                    </div>
                    {/* <DottedSeparator className='my-4'/>
                        <DataFilters  /> */}
                    <DottedSeparator className='my-4'/>
                    {isLoadingTasks ? (
                        <div className='w-full border-gold rounded-lg h-[200px] flex flex-col items-center justify-center'> 
                            <Loader className=' animate-spin  size-5 text-muted-foreground'/>
                        </div>
                    ): (
                    <>
                    <TabsContent value="table" className='mt-0'>
                      <DataTable
                        columns={createColumns(userId,)}
                      data={filteredTasks}
                      />
                     
                    </TabsContent>
                    <TabsContent value="kanban" className='mt-0'>
                        <TaskKanban
                        data={filteredTasks}
                        onChange={onKanbanChange}
                        userID={userId}
                        />
                  
                    </TabsContent>
                    <TabsContent value="calender" className='mt-0'>
                    <Calendar userId={userId} />
                    </TabsContent>
                    </>
                     )}
            </div>
    </Tabs>

  )
}
 