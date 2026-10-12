import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(10).max(80).regex(/[A-Za-z]/, "Include a letter.").regex(/[0-9]/, "Include a number."),
  role: z.enum(["USER", "EMPLOYER"]),
  companyName: z.string().trim().max(120).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(80),
});

export const emailSchema = z.object({ email: z.string().trim().email() });

export const resetSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(10).max(80).regex(/[A-Za-z]/).regex(/[0-9]/),
});
