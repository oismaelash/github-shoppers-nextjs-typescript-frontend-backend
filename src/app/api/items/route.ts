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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Validation error
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
 *     description: Returns a list of all available items
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: List of items
 */
export async function GET(req: NextRequest) {
  return itemController.getAll(req);
}
