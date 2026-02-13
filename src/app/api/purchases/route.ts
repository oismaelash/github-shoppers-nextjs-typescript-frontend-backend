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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *             properties:
 *               itemId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Purchase successful
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
 *     summary: List purchases
 *     description: Returns a history of purchases including item details and assigned GitHub users
 *     tags:
 *       - Purchases
 *     responses:
 *       200:
 *         description: List of purchases
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
  return purchaseController.list(req);
}
