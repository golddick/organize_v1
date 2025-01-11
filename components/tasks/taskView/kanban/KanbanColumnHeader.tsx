import React from 'react'
import { snakeCaseToTitleCase } from '@/lib/utils';
import { CircleCheckIcon,CircleIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, PlusIcon} from 'lucide-react'
import { Button } from '@/components/ui/button';
import { TaskStatus } from '@prisma/client';
// import { useCreateTaskModal } from '@/hooks/use-create-task-modal';

interface KanbanColumnHeaderProps {
    board: TaskStatus;
    taskCount: number
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG]: (
        <CircleDashedIcon className=' size-[18px] text-pink-400'/>
    ),
    [TaskStatus.TODO]: (
        <CircleIcon className=' size-[18px] text-gold'/>
    ),
    [TaskStatus.IN_PROGRESS]: (
        <CircleDotDashedIcon className=' size-[18px] text-purple-400'/>
    ),
    [TaskStatus.IN_REVIEW]: (
        <CircleDotIcon className=' size-[18px] text-blue-400'/>
    ),
    [TaskStatus.TESTING]: (
        <CircleDotIcon className=' size-[18px] text-red-400'/>
    ),
    [TaskStatus.DONE]: (
        <CircleCheckIcon className=' size-[18px] text-emerald-400'/>
    ),

}

export const KanbanColumnHeader = ({board, taskCount}:KanbanColumnHeaderProps) => {
    // const {open} = useCreateTaskModal()
    const icon = statusIconMap[board]
  return (
    <div className='px-2 py-1 flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
            {icon}
            <h2 className='text-sm font-medium'>{snakeCaseToTitleCase(board)}</h2>
            <p className='text-sm text-gray-500 size-5 bg-neutral-200 rounded-md flex justify-center items-center'>{taskCount} </p>
        </div>
        {/* <Button onClick={open} variant={'ghost'} size={'icon'} className='size-5'>
            <PlusIcon className='size-4 text-neutral-500'/>
        </Button> */}
    </div>
  )
}
