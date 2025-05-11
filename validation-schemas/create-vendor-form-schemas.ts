import { z } from "zod";

export const vendorFormSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email"),
  about: z.string().min(10, "About must be at least 10 characters"),
  profilePicture: z
  .custom<FileList>((file) => file instanceof FileList && file.length === 1, {
    message: "Please upload a profile picture that clearly shows your face.",
  })
  .refine(
    (file) => {
      const image = file.item(0);
      return (
        image &&
        ["image/jpeg", "image/png"].includes(image.type) &&
        image.size < 2 * 1024 * 1024 // 2MB
      );
    },
    {
      message: "Image must be a JPEG or PNG and under 2MB.",
    }
  ),

  businessName: z.string().min(1, "Business name is required"),
  brn: z.string().optional(),
  businessAddress: z.string().min(1,"Business address is required"),
  experience: z.string().min(1,"Select your experience level, required"),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  province: z.string().min(1,"Select your province"),
  city: z.string().min(1,"Select your city"),
  paypalEmail: z.string().email("Invalid email"),
  businessPhone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  socialLinks: z
  .array(
    z.object({
      url: z.string().url("Invalid URL").or(z.literal("")).optional(),
    })
  )
  .max(3, "Maximum 3 social links allowed"),
  legalDocuments: z
  .any()
  .optional()
  .refine((files) => {
    if (!files || !(files instanceof FileList) || files.length === 0) return true; 
    return Array.from(files).every((file) =>
      ["application/pdf", "image/png", "image/jpeg"].includes(file.type)
    );
  }, {
    message: "Only PDF, PNG, or JPEG files are allowed",
  }),

nicFront: z
  .custom<FileList>((file) => file instanceof FileList && file.length > 0, {
    message: "Please upload front side of your NIC",
  })
  .refine((files) => {
    return Array.from(files).every((file) =>
      ["image/png", "image/jpeg"].includes(file.type)
    );
  }, {
    message: "PNG, or JPEG files are allowed",
  }),
  nicBack: z
  .custom<FileList>((file) => file instanceof FileList && file.length > 0, {
    message: "Please upload back side of your NIC",
  })
  .refine((files) => {
    return Array.from(files).every((file) =>
      ["image/png", "image/jpeg"].includes(file.type)
    );
  }, {
    message: "PNG, or JPEG files are allowed",
  }),
  agreeToTerms: z
  .literal(true, {
    errorMap: () => ({
      message: "Please agree to the privacy policy & terms & conditions",
    }),
  }),
});


export type VendorFormData = z.infer<typeof vendorFormSchema>;
