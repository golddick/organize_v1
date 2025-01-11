import { ColumnDef } from '@tanstack/react-table';
import { Task } from "@prisma/client";
import { ReadOnlyEmoji } from "@/components/common/ReadOnlyEmoji";
import { ReadTaskOnlyCalendar } from "../../readOnly/ReadTaskOnlyCalendar";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { TaskOptions } from './TaskOptions';
import { AssignedToTaskUser } from '../../assignToTask/AssignedToTaskUser';
import { UserHoverInfoCardTableData } from '@/components/common/UserHoverInfoCardTableData';
import { TaskType } from '@/types/extended';
import { ProjectAvatar } from '@/components/sidebar/optionsSidebar/project/project-avatar';

export const createColumns = (userId: string): ColumnDef<TaskType>[] => [

  {
    accessorKey: 'project',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Project
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.original.project.title; 
  
      return (

        <div className="flex items-center gap-x-2 text-sm font-medium capitalize">
        <ProjectAvatar
        name={name}
        className="size-6"
        />
        <p className="line-clamp-1 "> {name}</p>
        </div>

      );
    }
  },
  
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Task Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.original.title;
      return <p className="line-clamp-1 capitalize items-center text-center">{name}</p>;
    }
  },

  {
    accessorKey: 'updatedBy',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Last update By
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const updatedBy = row.original.updatedUserId;

      return  <UserHoverInfoCardTableData userId={updatedBy } />
     
    }
  },

    {
    accessorKey: 'assign',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Assigned
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
        const id = row.original.id;
        const workspaceID = row.original.workspaceId
       
        return (
        <AssignedToTaskUser
        taskId={id}
        workspaceId={workspaceID}
        className='border p-2 px-4 focus:ring-0 hover:ring-0 text-md'
        />
        )
    }
  },

  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium capitalize">
          <ReadTaskOnlyCalendar 
            userId={userId} // Pass userId here
          />
        </div>
      );
    }
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.taskStatus;
      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    }
  },



  {
    id:'actions',
    cell: ({ row }) => {
        const id = row.original.id;
        const workspaceID = row.original.workspaceId
        return (
          <TaskOptions
          taskId={id}
          workspaceId={workspaceID}
          userId={userId}
        />
        )

      }
}
];
