import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@prisma/client";


interface StatusProps {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

export const Status = ({ status, onChange }: StatusProps) => {
    console.log(status)
    // console.log(onChange)
  return (
    // <Select defaultValue={status} onValueChange={(value) => onChange(value as TaskStatus)}>
    <Select  defaultValue={status} onValueChange={(status: string) => onChange(status as TaskStatus)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
         <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
        <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
        <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
        <SelectItem value={TaskStatus.TESTING}>Testing</SelectItem>
        <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
      </SelectContent>
    </Select>
  );
};
