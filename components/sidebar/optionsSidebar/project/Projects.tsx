



"use client";

import { useWorkspaceID } from "@/hooks/use-workspaceID";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProjectAvatar } from "./project-avatar";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjects } from "@/lib/api";
import { Project } from "@prisma/client";
import { AddProject } from "../../shortcutSidebar/newProject/AddProject";

export const Projects = () => {
  const workspaceID = useWorkspaceID();
  const pathname = usePathname();

  const [projects, setProjects] = useState<Project[]>([]); // State to hold fetched projects
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workspaceID) {
      setLoading(true);
      getProjects(workspaceID)
        .then((data) => {
          setProjects(data);
        })
        .catch((err) => {
          console.error("Failed to fetch projects:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [workspaceID]);

  if (!workspaceID) {
    return <p className="text-sm text-neutral-500">No workspace ID found.</p>;
  }

  return (
    <div className="flex flex-col gap-y-2 mb-2">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase text-neutral-500">Projects</p>
        <AddProject createdProjects={projects.length}/>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading projects...</p>
      ) : projects.length > 0 ? (
        projects.map((project) => {
          const href = `/en/dashboard/workspace/${workspaceID}/project/${project.id}`;
          const isActive = pathname === href;

          return (
            <Link href={href} key={project.id}>
              <div
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                  isActive && "bg-white text-gold shadow-sm hover:opacity-100"
                )}
              >
                <ProjectAvatar name={project.title}  fallbackClassName="bg-black text-gold"  />
                <span className={cn('truncate capitalize text-primary', isActive && 'text-black')}>{project.title}</span>
              </div>
            </Link>
          );
        })
      ) : (
        <p className="text-neutral-500">No projects found.</p>
      )}
    </div>
  );
};

