import { z } from 'zod';

export const CreateItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
});

export type CreateItemDTO = z.infer<typeof CreateItemSchema>;

export const ItemResponseSchema = CreateItemSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ItemResponseDTO = z.infer<typeof ItemResponseSchema>;
