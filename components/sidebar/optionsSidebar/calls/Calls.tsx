
"use client";

import ActiveLink from "@/components/ui/active-link";
import { Workspace } from "@prisma/client";
import { LockKeyhole, PhoneCall, PhoneIncoming, SunMoon, User2 } from "lucide-react";
import { useTranslations } from "next-intl";


const callFields = [
  {
    href: "/dashboard/calls",
    icon: <PhoneCall size={20} />,
    title: "CALL.CALL",
  },
  {
    href: "/dashboard/call/upcoming",
    icon: <PhoneIncoming size={20} />,
    title: "CALL.UPCOMING",
  },
];



export const Calls = () => {
  const t = useTranslations("SIDEBAR");
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <p className="text-xs sm:text-sm uppercase text-muted-foreground">
          {t("SETTINGS.GENERAL")}
        </p>
        <div className="flex flex-col gap-2 w-full mt-2">
          {callFields.map((settingField, i) => (
            <ActiveLink
              key={i}
              href={settingField.href}
              variant={"ghost"}
              size={"sm"}
              className="flex justify-start w-full items-center gap-2"
            >
              {settingField.icon}
              {t(settingField.title)}
            </ActiveLink>
          ))}
        </div>
      </div>
    </div>
  );
};
