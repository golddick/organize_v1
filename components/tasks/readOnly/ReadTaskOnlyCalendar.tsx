// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { te } from "date-fns/locale";
// import { CalendarIcon } from "lucide-react";
// import { useLocale, useTranslations } from "next-intl";
// import { useMemo } from "react";
// import { useQuery } from "@tanstack/react-query"; // Import useQuery for fetching tasks
// import { useWorkspaceID } from "@/hooks/use-workspaceID";
// import { useProjectID } from "@/hooks/use-projectID";

// interface Task {
//   id: string;
//   taskDate?: {
//     from?: Date;
//     to?: Date;
//   };
//   // Add other task properties as needed
// }

// export const ReadTaskOnlyCalendar = ({ userId }: { userId: string }) => {
//   const workspaceId = useWorkspaceID();
//   const projectID = useProjectID();

//   const lang = useLocale();
//   const t = useTranslations("TASK.EDITOR.READ_ONLY");

//   const currentLocale = useMemo(() => {
//     if (lang === "te") return te;
//     return undefined; // Default locale if needed
//   }, [lang]);

//   // Fetch all tasks for the given workspace and user
//   const { data: tasks, isLoading, isError } = useQuery<Task[]>({
//     queryKey: ["getTasks", workspaceId, userId],
//     queryFn: async () => {
//       const response = await fetch(`/api/task/get/all?workspaceId=${workspaceId}&userId=${userId}`);
//       if (!response.ok) throw new Error("Failed to fetch tasks");
//       return response.json();
//     },
//   });

//   // Calculate earliest 'from' date and latest 'to' date
//   const dates = useMemo(() => {
//     if (!Array.isArray(tasks) || tasks.length === 0) return { from: undefined, to: undefined };

//     let earliestFrom: Date | undefined;
//     let latestTo: Date | undefined;

//     tasks.forEach((task) => {
//       if (task.taskDate) {
//         if (task.taskDate.from) {
//           const fromDate = new Date(task.taskDate.from);
//           if (!earliestFrom || fromDate < earliestFrom) {
//             earliestFrom = fromDate;
//           }
//         }
//         if (task.taskDate.to) {
//           const toDate = new Date(task.taskDate.to);
//           if (!latestTo || toDate > latestTo) {
//             latestTo = toDate;
//           }
//         }
//       }
//     });

//     return { from: earliestFrom, to: latestTo };
//   }, [tasks]);

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error loading tasks.</div>;

  

//   return (
//     <Badge
//       className="px-2.5 py-0.5 h-fit text-xs bg-background w-fit"
//       variant={"outline"}
//     >
//       {/* <CalendarIcon size={16} className="mr-2 w-3 h-3" /> */}
//       {dates.from ? (
//         dates.to ? (
//           <>
//             {format(dates.from, "dd LLL y", {
//               locale: currentLocale,
//             })}{" "}
//             -{" "}
//             {format(dates.to, "dd LLL y", {
//               locale: currentLocale,
//             })}
//           </>
//         ) : (
//           format(dates.from, "dd LLL y", {
//             locale: currentLocale,
//           })
//         )
//       ) : (
//         <span>{t("NO_DATE")}</span>
//       )}
//     </Badge>
//   );
// };


import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { te } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaceID } from "@/hooks/use-workspaceID";
import { useProjectID } from "@/hooks/use-projectID";

interface Task {
  id: string;
  taskDate?: {
    from?: Date;
    to?: Date;
  };
}

export const ReadTaskOnlyCalendar = ({ userId }: { userId: string }) => {
  const workspaceId = useWorkspaceID();
  const projectID = useProjectID();

  const lang = useLocale();
  const t = useTranslations("TASK.EDITOR.READ_ONLY");

  const currentLocale = useMemo(() => {
    if (lang === "te") return te;
    return undefined;
  }, [lang]);

  const { data: tasks, isLoading, isError } = useQuery<Task[]>({
    queryKey: ["getTasks", workspaceId, userId],
    queryFn: async () => {
      const response = await fetch(
        `/api/task/get/all?workspaceId=${workspaceId}&userId=${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  const dates = useMemo(() => {
    if (!Array.isArray(tasks) || tasks.length === 0)
      return { from: undefined, to: undefined };

    let earliestFrom: Date | undefined;
    let latestTo: Date | undefined;

    tasks.forEach((task) => {
      if (task.taskDate) {
        if (task.taskDate.from) {
          const fromDate = new Date(task.taskDate.from);
          if (!earliestFrom || fromDate < earliestFrom) {
            earliestFrom = fromDate;
          }
        }
        if (task.taskDate.to) {
          const toDate = new Date(task.taskDate.to);
          if (!latestTo || toDate > latestTo) {
            latestTo = toDate;
          }
        }
      }
    });

    return { from: earliestFrom, to: latestTo };
  }, [tasks]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks.</div>;

  // Determine color based on how close the current date is to the `to` date
  const today = new Date();
  const endDate = dates.to;

  let textColor = "text-muted-foreground";

  if (endDate) {
    const diffInDays = differenceInDays(endDate, today);

    if (diffInDays <= 3) {
      textColor = "text-red-500";
    } else if (diffInDays <= 7) {
      textColor = "text-orange-500";
    } else if (diffInDays <= 14) {
      textColor = "text-yellow-500";
    }
  }

  return (
    <Badge
      className={`px-2.5 py-0.5 h-fit text-xs bg-background w-fit truncate border-none ${textColor}`}
      variant={"outline"}
    >
      {dates.from ? (
        dates.to ? (
          <>
            {format(dates.from, "dd LLL y", {
              locale: currentLocale,
            })}{" "}
            -{" "}
            {format(dates.to, "dd LLL y", {
              locale: currentLocale,
            })}
          </>
        ) : (
          format(dates.from, "dd LLL y", {
            locale: currentLocale,
          })
        )
      ) : (
        <span>{t("NO_DATE")}</span>
      )}
    </Badge>
  );
};


