import { z } from "zod";

export const serviceOverviewSchema = z.object({
  s_title: z.string().min(40, "Service title must be at least 40 characters.") .max(90, "Service title cannot exceed 90 characters."),
  s_category: z.string().min(1, "Service category is required."),
  s_subcategory: z.string().min(1, "Subcategory is required."),
  s_tags: z
  .array(z.string().regex(/^[a-zA-Z0-9]+$/, "Tags must be letters or numbers"))
  .min(1, "At least one tag is required")
  .max(6, "Maximum 6 tags allowed"),
  fullDescription: z
    .string()
    .min(50, "Please provide a detailed description")
    .max(1000, "Description cannot exceed 1000 characters."),
  basePrice: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(0, "Price cannot be negative"),
  basePriceFeatures: z
  .array(z.string().max(100, "Feature can't be longer than 100 characters"))
  .length(4)
  .refine(
    (arr) => arr[0].trim().length > 1 && arr[1].trim().length > 1,
    {
      message:
       "The first two features are required and must be at least 2 characters.",
    }
  ),
  cancellationPolicy: z
  .string()
  .min(10, "Cancellation & Refund Policy must be at least 10 characters.")
  .max(1000, "Cancellation & Refund Policy cannot exceed 1000 characters."),
    photoGallery: z
    .array(z.any())
    .min(1, "At least one photo is required")
    .max(4, "You can upload up to 4 images"),

  serviceableAreas: z
    .string()
    .min(3, "Please enter at least one serviceable area"),

  noticePeriod: z
    .string()
    .min(2, "Please specify a valid lead time (e.g. 2 weeks notice)"),

  otherDetails: z
    .string()
    .max(1000, "Too much detail! Keep it under 1000 characters")
    .optional(),
});


export type ServiceOverviewSchema = z.infer<typeof serviceOverviewSchema>;
