import { z } from "zod";

export const additionalUserInfoSecondPart = z.object({
  useCase: z.enum(["WORK", "SCHOOL", "PERSONAL_USE"], {
    required_error: "You need to select a notification type.",
  }),
});

export type AdditionalUserInfoSecondPart = z.infer<
  typeof additionalUserInfoSecondPart
>;
