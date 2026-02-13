import { z } from 'zod';

export const CreatePurchaseSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
});

export type CreatePurchaseDTO = z.infer<typeof CreatePurchaseSchema>;

export const PurchaseResponseSchema = z.object({
    id: z.string(),
    itemId: z.string(),
    githubLogin: z.string(),
    createdAt: z.date(),
});

export type PurchaseResponseDTO = z.infer<typeof PurchaseResponseSchema>;

export const PurchaseListResponseSchema = z.object({
    id: z.string(),
    githubLogin: z.string(),
    createdAt: z.date(),
    item: z.object({
        name: z.string(),
        price: z.number(),
    })
});

export type PurchaseListResponseDTO = z.infer<typeof PurchaseListResponseSchema>;
