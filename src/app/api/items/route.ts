import { ItemController } from "@/controllers/item.controller";
import { NextRequest } from "next/server";

const itemController = new ItemController();

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     description: Creates a new item in the catalog and triggers AI enhancement + share link generation
 *     tags:
 *       - Items
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateItemDTO'
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponseDTO'
 *             example:
 *               id: "clx123abc"
 *               name: "Premium Widget"
 *               description: "High-quality widget"
 *               price: 29.99
 *               quantity: 100
 *               createdAt: "2025-02-16T12:00:00.000Z"
 *               updatedAt: "2025-02-16T12:00:00.000Z"
 *               shareLink: "https://example.com/share/abc123"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Validation error details"
 *       401:
 *         description: Unauthorized
 */
export async function POST(req: NextRequest) {
  return itemController.create(req);
}

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: List all items
 *     description: Returns a list of all available items in the marketplace
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemResponseDTO'
 *             example:
 *               - id: "clx123abc"
 *                 name: "Premium Widget"
 *                 description: "High-quality widget"
 *                 price: 29.99
 *                 quantity: 100
 *                 createdAt: "2025-02-16T12:00:00.000Z"
 *                 updatedAt: "2025-02-16T12:00:00.000Z"
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  return itemController.getAll(req);
}
