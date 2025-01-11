"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useOnboardingForm } from "@/context/OnboardingForm";
import { useTranslations } from "next-intl";
import { UserAvatar } from "../avatar/user-avatar";

export const SummarySection = () => {
  const { name, surname, profileImage, useCase, currentStep } =
    useOnboardingForm();
  const t = useTranslations("ONBOARDING_FORM");
  return (
    <section className="hidden lg:w-1/2 bg-primary lg:flex justify-center items-center">
      {currentStep < 4 && (
        <div className="bg-card rounded-2xl w-96 min-h-[10rem] shadow-sm flex flex-col items-center p-4 py-8 gap-5">
          <UserAvatar
            className="w-32 h-32 shadow-sm mt-[-5rem]"
            size={40}
            profileImage={profileImage}
          />
          <div className="text-center space-y-1.5 text-3xl break-words max-w-xs font-semibold">
            {name && <p>{name}</p>}
            {surname && <p>{surname}</p>}
          </div>
          {!useCase && <span className="bg-muted rounded-md w-24 h-8"></span>}
          {useCase && (
            <p>
              {useCase === "WORK" && t("SECOND_STEP.WORK")}
              {useCase === "SCHOOL" && t("SECOND_STEP.SCHOOL")}
              {useCase === "PERSONAL_USE" && t("SECOND_STEP.PERSONAL")}
            </p>
          )}
        </div>
      )}
    </section>
  );
};
