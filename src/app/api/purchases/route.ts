import { PurchaseController } from "@/controllers/purchase.controller";
import { NextRequest } from "next/server";

const purchaseController = new PurchaseController();

/**
 * @swagger
 * /api/purchases:
 *   post:
 *     summary: Purchase an item
 *     description: Executes a transactional purchase, decrements stock, assigns a GitHub user, and sends a confirmation email.
 *     tags:
 *       - Purchases
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePurchaseDTO'
 *     responses:
 *       201:
 *         description: Purchase successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseResponseDTO'
 *             example:
 *               id: "clx456def"
 *               itemId: "clx123abc"
 *               githubLogin: "octocat"
 *               createdAt: "2025-02-16T12:00:00.000Z"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 *       409:
 *         description: Item out of stock
 */
export async function POST(req: NextRequest) {
  return purchaseController.create(req);
}

/**
 * @swagger
 * /api/purchases:
 *   get:
 *     summary: List all purchases
 *     description: Returns a history of all purchases including item details and assigned GitHub users. Requires admin.
 *     tags:
 *       - Purchases
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchases
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
  return purchaseController.list(req);
}
