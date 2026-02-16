import { ItemController } from "@/controllers/item.controller";
import type { NextRequest } from "next/server";

const itemController = new ItemController();

/**
 * @swagger
 * /api/items/{id}/sales:
 *   get:
 *     summary: Get sales for an item
 *     description: Returns sales summary for a specific item. Only the item owner can view.
 *     tags:
 *       - Items
 *       - Sales
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Sales summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesSummary'
 *             example:
 *               totalSales: 5
 *               revenue: 149.95
 *               sales:
 *                 - id: "clx456def"
 *                   buyer: "octocat"
 *                   pricePaid: 29.99
 *                   createdAt: "2025-02-16T12:00:00.000Z"
 *                   status: "CONFIRMED"
 *       403:
 *         description: Forbidden - not the item owner
 *       404:
 *         description: Item not found
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return itemController.sales(req, id);
}

