import { z } from "zod";

export const QRSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  eventTitle: z.string().min(2),
  eventDate: z.string(),
  eventLocation: z.string().min(2),
  budget: z.string().optional(),
  message: z.string().min(5),
});

export type QRFormData = z.infer<typeof QRSchema>;
