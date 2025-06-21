import { z } from 'zod';

export const personalInfoSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .nonempty("Name is required"),
    dob: z
        .date()
        .refine((date) => date <= new Date(), { message: "Date of birth must be in the past" }),
    occupation: z.enum(
        ["Student", "Employed", "Retired", "Business", "Self-employed", "Unemployed"],
        {
            message:
                "Occupation must be one of: Student, Employed, Retired, Business, Self-employed, or Unemployed",
        }
    ),
});