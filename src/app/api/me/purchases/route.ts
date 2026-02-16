import { PurchaseController } from "@/controllers/purchase.controller";
import type { NextRequest } from "next/server";

const purchaseController = new PurchaseController();

/**
 * @swagger
 * /api/me/purchases:
 *   get:
 *     summary: List my purchases
 *     description: Returns purchase history for the authenticated user (as buyer)
 *     tags:
 *       - Me
 *       - Purchases
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's purchases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseListResponseDTO'
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
  return purchaseController.listMine(req);
}

