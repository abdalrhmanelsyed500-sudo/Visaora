import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(1, "A slug is required")
  .max(120, "Slugs must be 120 characters or fewer")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

export const sourceSchema = z.object({
  title: z.string().trim().min(1).max(160),
  url: z.url(),
  publisher: z.string().trim().min(1).max(120),
  countryId: z.string().optional(),
  sourceType: z.enum([
    "GOVERNMENT",
    "EMBASSY",
    "IMMIGRATION_AUTHORITY",
    "CONSULATE",
    "APPLICATION_PORTAL",
    "OTHER",
  ]),
  accessedAt: z.coerce.date().optional(),
});

export const visaDraftSchema = z.object({
  countryId: z.string().min(1),
  categoryId: z.string().min(1),
  name: z.string().trim().min(1).max(180),
  slug: slugSchema,
  subcategory: z.string().trim().max(120).nullable().optional(),
  shortDescription: z.string().trim().max(320).nullable().optional(),
  longDescription: z.string().trim().max(20_000).nullable().optional(),
  purpose: z.string().trim().max(2_000).nullable().optional(),
  eligibility: z.string().trim().max(10_000).nullable().optional(),
  documents: z.array(z.string().trim().min(1).max(240)).max(100).default([]),
  fees: z.string().trim().max(500).nullable().optional(),
  processingTime: z.string().trim().max(500).nullable().optional(),
  validity: z.string().trim().max(500).nullable().optional(),
  stayDuration: z.string().trim().max(500).nullable().optional(),
  entries: z.string().trim().max(500).nullable().optional(),
  applicationMethod: z.string().trim().max(2_000).nullable().optional(),
  applicationSteps: z.array(z.string().trim().min(1).max(500)).max(30).default([]),
  sourceIds: z.array(z.string().min(1)).max(100).default([]),
  lastVerified: z.coerce.date().nullable().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
});

export type VisaDraftInput = z.infer<typeof visaDraftSchema>;

export function validateVisaForPublish(input: unknown) {
  const parsed = visaDraftSchema.safeParse(input);
  if (!parsed.success) return parsed;

  const value = parsed.data;
  const errors: string[] = [];
  if (!value.shortDescription) errors.push("A short description is required before publishing.");
  if (!value.longDescription) errors.push("An overview is required before publishing.");
  if (value.sourceIds.length === 0) errors.push("At least one official source is required before publishing.");
  if (!value.lastVerified) errors.push("A verification date is required before publishing.");

  if (errors.length) {
    return {
      success: false as const,
      error: new z.ZodError(
        errors.map((message) => ({ code: "custom", path: ["publish"], message })),
      ),
    };
  }

  return parsed;
}
