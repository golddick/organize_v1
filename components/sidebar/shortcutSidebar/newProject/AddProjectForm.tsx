"use client";

import { LoadingState } from "@/components/loader/loadingState";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  projectSchema,
  ProjectSchema,
  ApiProjectSchema,
} from "@/schema/projectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useWorkspaceID } from "@/hooks/use-workspaceID";

interface Props {
  onSetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddProjectForm = ({ onSetOpen }: Props) => {
  const workspaceId = useWorkspaceID();
  const t = useTranslations("AUTH.NEW_PROJECT");
  const m = useTranslations("MESSAGES");
  const { toast } = useToast();
  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
    },
  });

  const { mutate: newProject, isPending } = useMutation({
    mutationFn: async (data: ApiProjectSchema) => {
      const { data: result } = await axios.post("/api/project/new", data);
      return result;
    },

    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : "ERRORS.NEW_PROJECT";

      toast({
        title: m(error),
        variant: "destructive",
      });
    },
    onSuccess: () => {
      onSetOpen(false);
      toast({
        title: m("SUCCESS.NEW_PROJECT"),
      });
    },
    mutationKey: ["newProject"],
  });

  const onSubmit = async (data: ProjectSchema) => {

    console.log("Form Data Submitted:", data);

    newProject({
      projectName: data.projectName,
      workspaceID: workspaceId,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md w-full space-y-8"
      >
        <div className="space-y-1.5">
          <FormField
            name='projectName'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  {t("OTHERS.INPUTS.NAME")}
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-muted"
                    placeholder={t("PLACEHOLDERS.NAME")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
 
        <Button
          disabled={isPending || !form.formState.isValid}
          type="submit"
          className="w-full mt-10 max-w-md  font-semibold"
        >
          {isPending ? (
            <LoadingState loadingText={t("BTN_PENDING")} />
          ) : (
            t("BTN_ADD")
          )}
        </Button>
      </form>
    </Form>
  );
};

