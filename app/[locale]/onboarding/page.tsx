
import { AdditionalInfoSection } from "@/components/onboarding/AdditionalInfoSection";
import { SummarySection } from "@/components/onboarding/SummarySection";
import { OnboardingFormProvider } from "@/context/OnboardingForm";
import { getAuthSession } from "@/lib/auth";
import { checkIfUserCompletedOnboarding } from "@/lib/checkIfUserCompletedOnboarding";

const Onboarding = async () => {
  const session = await checkIfUserCompletedOnboarding("/onboarding");
  console.log('onboarding session',session)

  return (
    <OnboardingFormProvider session={session}>
      <AdditionalInfoSection profileImage={session.user.image} />
      <SummarySection />
    </OnboardingFormProvider>
  );
};

export default Onboarding;
