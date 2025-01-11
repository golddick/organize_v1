"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { UserInfo } from "@/types/extended";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../avatar/user-avatar";
import { Loader } from "lucide-react";

interface Props {
  userId: string | null; // `null` allows for conditional checks
  className?: string;
}

export const UserHoverInfoCardTableData = ({ userId, className }: Props) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setError("Invalid or missing userId");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/profile/get/details/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user information: ${response.statusText}`);
        }
        
        const data: UserInfo = await response.json();
        setUser(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]); // Run only when `userId` changes

  if (loading) {
    return (
      <Button
        variant={"ghost"}
        size={"sm"}
        className={cn(
          `px-1.5 w-fit hover:bg-transparent text-secondary-foreground font-semibold h-fit animate-spin`,
          className
        )}
      >
       <Loader/>
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        variant={"ghost"}
        size={"sm"}
        className={cn(
          `px-1.5 w-fit hover:bg-transparent text-secondary-foreground font-semibold h-fit`,
          className
        )}
      >
        Error
      </Button>
    );
  }

  return (
    <HoverCard openDelay={250} closeDelay={250}>
      <HoverCardTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className={cn(
            `px-1.5 w-fit hover:bg-neutral-300 h-fit`,
            className
          )}
        >
          <span className="line-clamp-1 capitalize items-center truncate">
          {user?.username}
          </span>
         
        </Button>
      </HoverCardTrigger>
      <HoverCardContent avoidCollisions={false} align="start" side="top">
        <div className="flex justify-center items-center gap-2">
          <UserAvatar
            profileImage={user?.image}
            className="w-10 h-10"
            size={12}
          />
          <div className="flex flex-col">
            <p>{user?.username}</p>
            {user?.name && user?.surname && (
              <p className="text-xs text-muted-foreground">
                {user.name} {user.surname}
              </p>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
