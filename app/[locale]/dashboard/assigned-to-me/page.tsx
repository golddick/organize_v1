import { AddTaskShortcut } from "@/components/addTaskShortCut/AddTaskShortcut";
import { AssignedToMeContainer } from "@/components/assigned-to-me/AssignedToMeContainer";
import { DashboardHeader } from "@/components/header/DashboardHeader";
import { checkIfUserCompletedOnboarding } from "@/lib/checkIfUserCompletedOnboarding";

const AssignedToMe = async () => {
  const session = await checkIfUserCompletedOnboarding(
    "/dashboard/assigned-to-me"
  );

  return (
    <>
      <DashboardHeader/>
      <main>
        <AssignedToMeContainer userId={session.user.id} />
      </main>
    </>
  );
};

export default AssignedToMe;
