import { database } from "@/lib/database";
import { sortMindMapsAndTasksDataByUpdatedAt } from "@/lib/sortMindMapsAndTasksDataByUpdatedAt";
import {
  AssignedItemType,
  AssignedToMeTaskAndMindMaps,
} from "@/types/extended";
import { NextResponse } from "next/server";

// Helper function to map task data
const mapTaskData = (tasks: any[], workspaceName: string) => {
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    emoji: task.emoji,
    link: `/dashboard/workspace/${task.workspaceId}/tasks/task/${task.id}`,
    workspaceName,
    createdAt: task.createdAt,
    type: "task" as AssignedItemType,
    workspaceId: task.workspaceId,
    updated: {
      at: task.updatedAt,
      by: task.updatedBy,
    },
    starred: task.savedTask.length > 0,
  }));
};

// Helper function to map mind map data
const mapMindMapData = (mindMaps: any[], workspaceName: string) => {
  return mindMaps.map((mindMap) => ({
    id: mindMap.id,
    title: mindMap.title,
    emoji: mindMap.emoji,
    link: `/dashboard/workspace/${mindMap.workspaceId}/mind-maps/mind-map/${mindMap.id}`,
    workspaceName,
    createdAt: mindMap.createdAt,
    type: "mindMap" as AssignedItemType,
    workspaceId: mindMap.workspaceId,
    updated: {
      at: mindMap.updatedAt,
      by: mindMap.updatedBy,
    },
    starred: mindMap.savedMindMaps.length > 0,
  }));
};

export const GET = async (request: Request) => {
  const url = new URL(request.url);

  const workspaceFilterParam = url.searchParams.get("workspace");
  const userId = url.searchParams.get("userId");
  const currentType = url.searchParams.get("type");

  // Early validation for userId
  if (!userId) {
    console.warn("User ID is missing");
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 404 });
  }

  // Early validation for type
  const validTypes = ["tasks", "mind-maps"];
  if (currentType && !validTypes.includes(currentType)) {
    return NextResponse.json("ERRORS.INVALID_TYPE", { status: 400 });
  }

  try {
    // Handling workspace filter parameter
    if (workspaceFilterParam && workspaceFilterParam !== "all") {
      const taskAndMindMaps = await database.workspace.findUnique({
        where: {
          id: workspaceFilterParam,
        },
        include: {
          tasks: {
            where: {
              assignedToTask: {
                some: {
                  userId,
                },
              },
            },
            include: {
              updatedBy: {
                select: {
                  username: true,
                  name: true,
                  id: true,
                  image: true,
                  surname: true,
                },
              },
              savedTask: {
                where: {
                  userId,
                },
                select: {
                  taskId: true,
                },
              },
            },
          },
          mindMaps: {
            where: {
              assignedToMindMap: {
                some: {
                  userId,
                },
              },
            },
            include: {
              updatedBy: {
                select: {
                  username: true,
                  name: true,
                  id: true,
                  image: true,
                  surname: true,
                },
              },
              savedMindMaps: {
                where: {
                  userId,
                },
                select: {
                  mindMapId: true,
                },
              },
            },
          },
        },
      });

      if (!taskAndMindMaps) {
        return NextResponse.json("ERRORS.NO_WORKSPACE", { status: 404 });
      }

      switch (currentType) {
        case "tasks":
          const assignedTasksData: AssignedToMeTaskAndMindMaps = {
            tasks: mapTaskData(taskAndMindMaps.tasks, taskAndMindMaps.name),
            mindMaps: [],
          };
          return NextResponse.json(
            sortMindMapsAndTasksDataByUpdatedAt(assignedTasksData),
            { status: 200 }
          );

        case "mind-maps":
          const assignedMindMapsData: AssignedToMeTaskAndMindMaps = {
            mindMaps: mapMindMapData(taskAndMindMaps.mindMaps, taskAndMindMaps.name),
            tasks: [],
          };
          return NextResponse.json(
            sortMindMapsAndTasksDataByUpdatedAt(assignedMindMapsData),
            { status: 200 }
          );

        default:
          const assignedAllData: AssignedToMeTaskAndMindMaps = {
            tasks: mapTaskData(taskAndMindMaps.tasks, taskAndMindMaps.name),
            mindMaps: mapMindMapData(taskAndMindMaps.mindMaps, taskAndMindMaps.name),
          };
          return NextResponse.json(
            sortMindMapsAndTasksDataByUpdatedAt(assignedAllData),
            { status: 200 }
          );
      }
    } else {
      const taskAndMindMaps = await database.workspace.findMany({
        include: {
          tasks: {
            where: {
              assignedToTask: {
                some: {
                  userId,
                },
              },
            },
            include: {
              updatedBy: {
                select: {
                  username: true,
                  name: true,
                  id: true,
                  image: true,
                  surname: true,
                },
              },
              savedTask: {
                where: {
                  userId,
                },
                select: {
                  taskId: true,
                },
              },
            },
          },
          mindMaps: {
            where: {
              assignedToMindMap: {
                some: {
                  userId,
                },
              },
            },
            include: {
              updatedBy: {
                select: {
                  username: true,
                  name: true,
                  id: true,
                  image: true,
                  surname: true,
                },
              },
              savedMindMaps: {
                where: {
                  userId,
                },
                select: {
                  mindMapId: true,
                },
              },
            },
          },
        },
      });

      if (taskAndMindMaps.length === 0) {
        return NextResponse.json([], { status: 200 });
      }

      const assignedData: AssignedToMeTaskAndMindMaps = {
        tasks: [],
        mindMaps: [],
      };

      switch (currentType) {
        case "tasks":
          taskAndMindMaps.forEach((item) => {
            assignedData.tasks.push(...mapTaskData(item.tasks, item.name));
          });
          break;
        case "mind-maps":
          taskAndMindMaps.forEach((item) => {
            assignedData.mindMaps.push(...mapMindMapData(item.mindMaps, item.name));
          });
          break;
        default:
          taskAndMindMaps.forEach((item) => {
            assignedData.tasks.push(...mapTaskData(item.tasks, item.name));
            assignedData.mindMaps.push(...mapMindMapData(item.mindMaps, item.name));
          });
          break;
      }

      return NextResponse.json(
        sortMindMapsAndTasksDataByUpdatedAt(assignedData),
        {
          status: 200,
        }
      );
    }
  } catch (err) {
    console.error("Database error:", err); // Log the error for debugging
    return NextResponse.json("ERRORS.DB_ERROR", { status: 500 });
  }
};
