"use client";

import { LoadingState } from "@/components/loader/loadingState";
import { UploadFile } from "@/components/onboarding/common/UploadFile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import {
  ApiWorkspaceSchema,
  workspaceSchema,
  WorkspaceSchema,
} from "@/schema/workspaceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  onSetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddWorkspaceForm = ({ onSetOpen }: Props) => {
  const t = useTranslations("AUTH.NEW_WORKSPACE");
  const m = useTranslations("MESSAGES");
  const { toast } = useToast();
  const form = useForm<WorkspaceSchema>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: "",
    },
  });
  const [uploadError, setUploadError] = useState(false);

  const { mutate: newWorkspace, isPending } = useMutation({
    mutationFn: async (data: ApiWorkspaceSchema) => {
      const { data: result } = await axios.post("/api/workspace/new", data);
      return result;
    },
    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : "ERRORS.DEFAULT";

      toast({
        title: m(error),
        variant: "destructive",
      });
    },
    onSuccess: () => {
      onSetOpen(false);
      toast({
        title: m("SUCCESS.NEW_WORKSPACE"),
      });
    },
    mutationKey: ["newWorkspace"],
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadError: () => {
      setUploadError(true);
      toast({
        title: m("ERRORS.WORKSPACE_ICON_ADDED"),
        variant: "destructive",
      });
    },
    onClientUploadComplete: (data) => {
      if (!data) {
        setUploadError(true);
        toast({
          title: m("ERRORS.WORKSPACE_ICON_ADDED"),
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = async (data: WorkspaceSchema) => {
    setUploadError(false);

    const image: File | undefined | null = data.file;

    let workspaceImageURL: null | string = null;
    if (image) {
      const data = await startUpload([image]);
      if (data) workspaceImageURL = data[0].url;
    }
    if (uploadError) return;

    newWorkspace({
      workspaceName: data.workspaceName,
      file: workspaceImageURL,
      useCase: data.useCase
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
            name="workspaceName"
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
          <FormField
            name='useCase'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  {t("OTHERS.INPUTS.NAME")}
                </FormLabel>
                <FormControl>
                <Select 
                 value={field.value}
                 onValueChange={(value) => field.onChange(value)}
                >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Use case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WORK">Work</SelectItem>
                  <SelectItem value="SCHOOL">Institution</SelectItem>
                  <SelectItem value="PERSONAL_USE">Personal use</SelectItem>
                </SelectContent>
              </Select>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <UploadFile
          form={form}
          schema={workspaceSchema}
          inputAccept="image/*"
          typesDescription={t("IMAGE")}
          ContainerClassName="w-full"
          LabelClassName="text-muted-foreground mb-1.5 self-start"
          LabelText={t("OTHERS.INPUTS.FILE")}
        />
        <Button
          disabled={isUploading || isPending || !form.formState.isValid}
          // disabled={!form.formState.isValid || isUploading || isPending}
          type="submit"
          className="w-full mt-10 max-w-md dark:text-white font-semibold"
        >
          {isUploading || isPending ? (
            <LoadingState loadingText={t("BTN_PENDING")} />
          ) : (
            t("BTN_ADD")
          )}
        </Button>
      </form>
    </Form>
  );
};
