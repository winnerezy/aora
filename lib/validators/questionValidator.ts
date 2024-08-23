import { z } from "zod";

export const questionValidator = z.object({
    message: z.string().min(1)
})

export type questionValidator = z.infer<typeof questionValidator>