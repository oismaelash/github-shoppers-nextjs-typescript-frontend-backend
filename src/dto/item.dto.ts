import { z } from 'zod';

export const CreateItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
});

export type CreateItemDTO = z.infer<typeof CreateItemSchema>;

export const ItemResponseSchema = CreateItemSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  shareLink: z.string().nullable().optional(),
  userId: z.string().nullable().optional(),
  sellerGithubLogin: z.string().nullable().optional(),
  sellerImage: z.string().nullable().optional(),
});

export type ItemResponseDTO = z.infer<typeof ItemResponseSchema>;

export const UpdateItemSchema = CreateItemSchema.partial();

export type UpdateItemDTO = z.infer<typeof UpdateItemSchema>;
