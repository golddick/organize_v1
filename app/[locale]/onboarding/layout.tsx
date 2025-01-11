import React from "react";
import { ThemeToggle } from "@/components/themeToogleBTN";
import { LocaleSwitcher } from "@/components/switcher/LocaleSwitcher";


const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen w-full">
      <div className="absolute top-0 left-0 w-full flex justify-end">
        <div className="flex items-center gap-2 max-w-7xl p-4 md:p-6">
          <LocaleSwitcher/>
          <ThemeToggle
          />
        </div>
      </div>
      {children}
    </main>
  );
};

export default OnboardingLayout;
