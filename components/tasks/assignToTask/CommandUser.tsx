"use client";

import { UserAvatar } from "@/components/avatar/user-avatar";
import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AssignedToTaskUser } from "@/types/extended";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
  user: AssignedToTaskUser;
  taskId: string;
  workspaceId: string;
  canEdit: boolean;
}

export const CommandUser = ({ user, taskId, workspaceId, canEdit }: Props) => {
  const [isActiveUser, setIsActiveUser] = useState(
    user.user.assignedToTask.length === 1 ? true : false
  ); 

  const m = useTranslations("MESSAGES");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: handleTaskAssignment } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/assigned_to/tasks/assign`, {
        taskId,
        workspaceId,
        assignToUserId: user.user.id,
      });
    },
    onMutate: async () => {
      //@ts-ignore
      await queryClient.cancelQueries(["getAssignedToTaskInfo"]);

      setIsActiveUser((prev) => !prev);
    },
    onError: (err: AxiosError) => {
      setIsActiveUser((prev) => !prev);
      const error = err?.response?.data ? err.response.data : "ERRORS_DEFAULT";

      toast({
        title: m(error),
        variant: "destructive",
      });
    },
    onSettled: () => {
      //@ts-ignore
      queryClient.invalidateQueries(["getAssignedToTaskInfo", taskId]);
    },
    mutationKey: ["handleTaskAssignment", taskId],
  });

  return (
    <CommandItem className="p-0 flex flex-col gap-2">
      <Button
        disabled={!canEdit}
        onClick={() => {
          handleTaskAssignment();
        }}
        size={"sm"}
        variant={"ghost"}
        className={cn("w-full h-fit justify-between px-2 py-1.5 text-xs", isActiveUser && " bg-gold")}
      >
        <div className="flex items-center gap-2">
          <UserAvatar
            profileImage={user.user.image}
            className="w-8 h-8"
            size={10}
          />
          <p className={cn("text-secondary-foreground", isActiveUser && 'text-black')}>{user.user.username}</p>
        </div>

        {isActiveUser && <Check className="text-primary" size={16} />}
      </Button>
    </CommandItem>
  );
};
