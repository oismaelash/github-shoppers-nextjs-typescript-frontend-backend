import { ItemController } from "@/controllers/item.controller";
import type { NextRequest } from "next/server";

const itemController = new ItemController();

/**
 * @swagger
 * /api/me/items:
 *   get:
 *     summary: List my items
 *     description: Returns items owned by the authenticated user
 *     tags:
 *       - Me
 *       - Items
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemResponseDTO'
 *       401:
 *         description: Unauthorized
 */
export async function GET(req: NextRequest) {
  return itemController.getMine(req);
}

