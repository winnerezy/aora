import { z } from "zod";

export const userRequestValidator = z.object({
    messages: z.string().array(),
    model: z.string().default("llama-3.1-70b-versatile"),
    temperature: z.number().default(0.5),
    fileUrl: z.string()
})

export type userRequestValidator = z.infer<typeof userRequestValidator>