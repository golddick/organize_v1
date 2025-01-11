// 'use client'

// import { useState, useEffect } from "react";
// import { getAuthSession } from "@/lib/auth";
// import { BreadcrumbNav } from "./BreadcrumbNav";
// import { User } from "./User";
// import Welcoming from "../common/Welcoming";
// import { OpenSidebar } from "./OpenSidebar";
// import { cn } from "@/lib/utils";
// import { SavingStatus } from "./SavingStatus";
// import { BackBtn } from "./BackBtn";
// import { NotificationContainer } from "../notifications/NotificationContainer";

// interface Props {
//   addManualRoutes?: {
//     name: string;
//     href: string;
//     useTranslate?: boolean;
//     emoji?: string;
//   }[];
//   className?: string;
//   children?: React.ReactNode;
//   workspaceHref?: string;
//   hideBreadCrumb?: boolean;
//   showingSavingStatus?: boolean;
//   showBackBtn?: boolean;
// }

// export const DashboardHeader = ({
//   addManualRoutes,
//   className,
//   children,
//   workspaceHref,
//   hideBreadCrumb,
//   showingSavingStatus,
//   showBackBtn,
// }: Props) => {
//   const [session, setSession] = useState<any>(null);

//   useEffect(() => {
//     const fetchSession = async () => {
//       const authSession = await getAuthSession();
//       setSession(authSession);
//     };
//     fetchSession();
//   }, []);

//   if (!session) return null;  // Show nothing if session is not available

//   return (
//     <header
//       className={cn(
//         "flex w-full justify-between items-center mb-4 py-2 gap-2",
//         className
//       )}
//     >
//       <div className="flex items-center gap-2">
//         <OpenSidebar />
//         <Welcoming 
//           hideOnMobile
//           hideOnDesktop
//           username={session?.user.username!}
//           name={session?.user.name}
//           surname={session?.user.surname}
//           showOnlyOnPath="/dashboard"
//         />
//         {showBackBtn && <BackBtn />}
//         {showingSavingStatus && <SavingStatus />}
//         {!hideBreadCrumb && (
//           <BreadcrumbNav
//             addManualRoutes={addManualRoutes}
//             workspaceHref={workspaceHref}
//           />
//         )}
//       </div>
//       <div className="flex items-center gap-1 sm:gap-2">
//         <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
//           {children}
//           <NotificationContainer userId={session.user.id} />
//         </div>

//         <User
//           profileImage={session?.user.image}
//           username={session.user.username!}
//           email={session.user.email!}
//         />
//       </div>
//     </header>
//   );
// };


import { getAuthSession } from "@/lib/auth";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { User } from "./User";
import Welcoming from "../common/Welcoming";
import { OpenSidebar } from "./OpenSidebar";
import { cn } from "@/lib/utils";
import { SavingStatus } from "./SavingStatus";
import { BackBtn } from "./BackBtn";
import { NotificationContainer } from "../notifications/NotificationContainer";

interface Props {
  addManualRoutes?: {
    name: string;
    href: string;
    useTranslate?: boolean;
    emoji?: string;
  }[];
  className?: string;
  children?: React.ReactNode;
  workspaceHref?: string;
  hideBreadCrumb?: boolean;
  showingSavingStatus?: boolean;
  showBackBtn?: boolean;
}

export const DashboardHeader = async ({
  addManualRoutes,
  className,
  children,
  workspaceHref,
  hideBreadCrumb,
  showingSavingStatus,
  showBackBtn,
}: Props) => {
  const session = await getAuthSession();
  if (!session) return null;
  return (
    <header
      className={cn(
        "flex w-full justify-between items-center mb-4 py-2 gap-2",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <OpenSidebar />
        <Welcoming
          hideOnMobile
          hideOnDesktop
          username={session?.user.username!}
          name={session?.user.name}
          surname={session?.user.surname}
          showOnlyOnPath="/dashboard"
        />
        {showBackBtn && <BackBtn />}
        {showingSavingStatus && <SavingStatus />}
        {!hideBreadCrumb && (
          <BreadcrumbNav
            addManualRoutes={addManualRoutes}
            workspaceHref={workspaceHref}
          />
        )}
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
          {children}
          <NotificationContainer userId={session.user.id} />
        </div>

        <User
          profileImage={session?.user.image}
          username={session.user.username!}
          email={session.user.email!}
        />
      </div>
    </header>
  );
};

