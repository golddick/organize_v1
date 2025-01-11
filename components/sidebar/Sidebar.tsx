import { getAuthSession } from "@/lib/auth";
import { SidebarContainer } from "./SidebarContainer";
import { getUserAdminWorkspaces, getWorkspaces } from "@/lib/api";
import { ShortcutSidebar } from "./shortcutSidebar/ShortcutSidebar";
import { OptionsSidebar } from "./optionsSidebar/OptionsSidebar";

export const Sidebar = async () => {
  const session = await getAuthSession();
  if (!session) return null;

  const [userWorkspaces, userAdminWorkspaces] = await Promise.all([
    getWorkspaces(session.user.id),
    getUserAdminWorkspaces(session.user.id),
  ]);

  console.log('userWorkspaces sidebar',  userWorkspaces)
  console.log(userAdminWorkspaces)

  return (
    <SidebarContainer
      // userWorkspaces={userWorkspaces ? userWorkspaces : []}
      userWorkspaces={userWorkspaces}
      userAdminWorkspaces={userAdminWorkspaces ? userAdminWorkspaces : []}
      userId={session.user.id}
      
    />
   
  );
};
