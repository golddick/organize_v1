import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Folder, ListCheck, User2Icon } from 'lucide-react';

interface DataFiltersProps {
    hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
    // Static data for demonstration purposes
    const projectOptions = [
        { value: 'project1', label: 'Project One' },
        { value: 'project2', label: 'Project Two' },
        { value: 'project3', label: 'Project Three' },
    ];

    const memberOptions = [
        { value: 'member1', label: 'Member One' },
        { value: 'member2', label: 'Member Two' },
        { value: 'member3', label: 'Member Three' },
    ];

    // Static filter states for demonstration
    const [status, setStatus] = React.useState<string | null>(null);
    const [assigneeID, setAssigneeID] = React.useState<string | null>(null);
    const [projectID, setProjectID] = React.useState<string | null>(null);
    const [dueDate, setDueDate] = React.useState<string | null>(null);
    const [search, setSearch] = React.useState<string | null>(null);

    const onStatusChange = (value: string) => {
        setStatus(value === 'all' ? null : value);
    };

    const onAssigneeChange = (value: string) => {
        setAssigneeID(value === 'all' ? null : value);
    };

    const onProjectChange = (value: string) => {
        setProjectID(value === 'all' ? null : value);
    };

    const onDueDateChange = (value: string) => {
        setDueDate(value === 'all' ? null : value);
    };

    const onSearchChange = (value: string) => {
        setSearch(value === 'all' ? null : value);
    };

  return (
    <div className='flex flex-col lg:flex-row gap-2'>
        <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
            <SelectTrigger className='w-full lg:w-auto h-8'>
                <div className='flex items-center pr-2'>
                    <ListCheck className='size-4 mr-2'/>
                    <SelectValue placeholder='All statuses'/>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>All statuses</SelectItem>
                <SelectSeparator/>
                <SelectItem value='backlog'>Backlog</SelectItem>
                <SelectItem value='in_progress'>In Progress</SelectItem>
                <SelectItem value='in_review'>In Review</SelectItem>
                <SelectItem value='todo'>Todo</SelectItem>
                <SelectItem value='done'>Done</SelectItem>
            </SelectContent>
        </Select>

        <Select defaultValue={assigneeID ?? undefined} onValueChange={onAssigneeChange}>
            <SelectTrigger className='w-full lg:w-auto h-8'>
                <div className='flex items-center pr-2'>
                    <User2Icon className='size-4 mr-2'/>
                    <SelectValue placeholder='All assignees'/>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>All Assignees</SelectItem>
                <SelectSeparator/>
                {memberOptions.map((member) => (
                    <SelectItem key={member.value} value={member.value}>{member.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>

        {!hideProjectFilter && (
            <Select defaultValue={projectID ?? undefined} onValueChange={onProjectChange}>
                <SelectTrigger className='w-full lg:w-auto h-8'>
                    <div className='flex items-center pr-2'>
                        <Folder className='size-4 mr-2'/>
                        <SelectValue placeholder='All projects'/>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>All projects</SelectItem>
                    <SelectSeparator/>
                    {projectOptions.map((project) => (
                        <SelectItem key={project.value} value={project.value}>{project.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )}

        {/* Static DateTimePicker */}
        {/* Replace with your DateTimePicker component */}
        {/* This is just a placeholder for demonstration */}
        {/* You can implement the DateTimePicker or any other date picker as needed */}
        {/* For example, you might want to use a simple input for now */}
        <input
            type="date"
            placeholder="Due date"
            className="h-7 w-[250px] lg:w-[250px]"
            onChange={(e) => setDueDate(e.target.value)}
        />
        
        {/* Search input */}
        {/* You can add a search input if needed */}
        <input
            type="text"
            placeholder="Search..."
            className="h-7 w-[250px] lg:w-[250px]"
            onChange={(e) => onSearchChange(e.target.value)}
        />
    </div>
  );
};
