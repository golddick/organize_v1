"use client";

import { LoadingState } from "@/components/loader/loadingState";
import { Button } from "@/components/ui/button";
import { useOnboardingForm } from "@/context/OnboardingForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { ActionType } from "@/types/onBoardingContext";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const Finish = () => {
  const t = useTranslations("ONBOARDING_FORM");
  
  const { workspaceName, workspaceImage, surname, useCase, name, currentStep, dispatch } =
    useOnboardingForm();
  const { toast } = useToast();
  const m = useTranslations("MESSAGES");
  const { update } = useSession();
  const router = useRouter();
  const [isDone, setIsDone] = useState(false);

  const { mutate: completeOnboarding, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/onboarding", {
        name,
        useCase,
        workspaceImage,
        workspaceName,
        surname
      });

  
      return data;
    },
    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : err;
      
      toast({
        title: m("ERROR"),
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      setIsDone(true);
      toast({ 
        title: m("SUCCESS.ONBOARDING_COMPLETE"),
      });
      await update();
      router.push("/dashboard");
      router.refresh();
    },
    mutationKey: ["completeOnboarding"],
  });

  const goBack = () => {
    if (currentStep > 0) {
      dispatch({ type: ActionType.CHANGE_SITE, payload: currentStep - 1 });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 w-full mt-10 text-center">
        <h2 className="font-bold text-4xl md:text-5xl  max-w-xs">
          {t("FINISH.TITLE")}
        </h2>
      </div>
      <div className="font-bold text-xl sm:text-2xl md:text-3xl w-full max-w-lg text-center">
        <p>
          {t("FINISH.DESC_FIRST")}{" "}
          <span>
             <span className="text-primary font-semibold">ORGANIZE</span>
             <br/>
          </span>
          {t("FINISH.DESC_SECOND")}{" "}
        </p>
     <div className="flex flex-col gap-2 mt-10 sm:mt-32">
     <Button onClick={goBack} >
            <ArrowLeft  className="ml-2" width={18} height={18}/>
            Go Back
          </Button>
        <Button
          disabled={isPending || isDone}
          onClick={() => completeOnboarding()}
          type="submit"
          className=" w-full max-w-md dark:text-white font-semibold"
        >
          {isPending || isDone ? (
            <LoadingState loadingText={isDone ? t("IS_DONE") : ""} />
          ) : (
            <>{t("START_BTN")}</>
          )}
        </Button>
     </div>
      </div>
    </>
  );
};
