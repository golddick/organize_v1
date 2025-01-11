


import React, { useCallback, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { KanbanColumnHeader } from './KanbanColumnHeader';
import { KanbanCard } from './kanban-card';
import { Task, TaskStatus } from '@prisma/client';
import { TaskType } from '@/types/extended';

const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.TESTING,
    TaskStatus.DONE,
];

type TasksState = {
    [key in TaskStatus]:  TaskType[];
};

interface TaskKanbanProps {
    data: TaskType[];
    onChange: (task: { $id: string; status: TaskStatus; position: number }[]) => void;
    userID: string
}

export const TaskKanban = ({ data, onChange, userID }: TaskKanbanProps) => {
    const [tasks, setTasks] = useState<TasksState>(() => {
        const initialTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.TESTING]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            initialTasks[task.taskStatus].push(task);
        });

        // Sort tasks by position, handling null values
        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort((a, b) => {
                const aPosition = a.position ? parseInt(a.position) : Number.MAX_VALUE; // Handle null
                const bPosition = b.position ? parseInt(b.position) : Number.MAX_VALUE; // Handle null
                return aPosition - bPosition;
            });
        });

        return initialTasks;
    });

    useEffect(() => {
        const newTask: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.TESTING]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            newTask[task.taskStatus].push(task);
        });

        // Sort tasks by position again on data change
        Object.keys(newTask).forEach((status) => {
            newTask[status as TaskStatus].sort((a, b) => {
                const aPosition = a.position ? parseInt(a.position) : Number.MAX_VALUE; // Handle null
                const bPosition = b.position ? parseInt(b.position) : Number.MAX_VALUE; // Handle null
                return aPosition - bPosition;
            });
        });

        setTasks(newTask);
    }, [data]);

    const onDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) return;

        const { destination, source } = result;

        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;

        if (sourceStatus === destStatus && source.index === destination.index) return;

        let updatesPayload: { $id: string; status: TaskStatus; position: number }[] = [];

        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };

            // Remove the task from the source column
            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index, 1);

            if (!movedTask) {
                console.error('No task found at the source index');
                return prevTasks;
            }

            const updatedMovedTask = sourceStatus !== destStatus ?
                { ...movedTask, taskStatus: destStatus } : movedTask;

            newTasks[sourceStatus] = sourceColumn;

            // Add the task to the destination column
            const destColumn = [...newTasks[destStatus]];
            destColumn.splice(destination.index, 0, updatedMovedTask);
            newTasks[destStatus] = destColumn;

            // Prepare update payload
            updatesPayload.push({
                $id: updatedMovedTask.id,
                status: destStatus,
                position: Math.min((destination.index + 1) * 1000, 1_000_000),
            });

            return newTasks;
        });

        onChange(updatesPayload);

        if (updatesPayload.length > 0) {
            console.log('Updated tasks:', updatesPayload);
        }
    }, [onChange]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='flex overflow-x-auto'>
                {boards.map((board) => (
                    <div key={board} className='flex-1 mx-2 bg-muted p-2 rounded-md min-w-[200px]'>
                        <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
                        <Droppable droppableId={board}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="min-h-[200px] py-1"
                                >
                                    {tasks[board].map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <KanbanCard task={task} userID={userID} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};
