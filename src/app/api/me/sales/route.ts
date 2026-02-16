import { PurchaseController } from "@/controllers/purchase.controller";
import type { NextRequest } from "next/server";

const purchaseController = new PurchaseController();

/**
 * @swagger
 * /api/me/sales:
 *   get:
 *     summary: List my sales
 *     description: Returns sales made by the authenticated user (as seller)
 *     tags:
 *       - Me
 *       - Sales
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's sales
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
    return purchaseController.listSellerSales(req);
}
