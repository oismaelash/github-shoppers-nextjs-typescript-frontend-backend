import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LedgerService } from "@/services/ledger.service";

const ledgerService = new LedgerService();

/**
 * @swagger
 * /api/ledger:
 *   get:
 *     summary: List ledger entries
 *     description: Returns purchase ledger entries with optional search filter
 *     tags:
 *       - Ledger
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Filter by product, seller or buyer (case-insensitive)
 *     responses:
 *       200:
 *         description: List of ledger entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LedgerEntry'
 *             example:
 *               - id: "clx456def"
 *                 product: "Premium Widget"
 *                 seller: "octocat"
 *                 buyer: "buyer123"
 *                 price: 29.99
 *                 createdAt: "2025-02-16T12:00:00.000Z"
 *                 status: "VERIFIED"
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") ?? undefined;
    const entries = await ledgerService.list(query);
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error("Ledger Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

