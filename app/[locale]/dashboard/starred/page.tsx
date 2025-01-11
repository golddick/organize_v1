import { AddTaskShortcut } from "@/components/addTaskShortCut/AddTaskShortcut";
import { DashboardHeader } from "@/components/header/DashboardHeader";
import { ShortCutNewTask } from "@/components/sidebar/shortcutSidebar/newTask/ShortCutNewTask";
import { StarredContainer } from "@/components/starred/StarredContainer";
import { checkIfUserCompletedOnboarding } from "@/lib/checkIfUserCompletedOnboarding";

const Starred = async () => {
  const session = await checkIfUserCompletedOnboarding("/dashboard/starred");

  return (
    <>
      <DashboardHeader>
      <ShortCutNewTask/>
      </DashboardHeader>
      <main>
        <StarredContainer userId={session.user.id} />
      </main>
    </>
  );
};

export default Starred;
