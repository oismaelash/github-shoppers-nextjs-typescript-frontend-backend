import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LedgerService } from "@/services/ledger.service";

const ledgerService = new LedgerService();

/**
 * @swagger
 * /api/ledger/export:
 *   get:
 *     summary: Export ledger as CSV
 *     description: Downloads the full ledger as a CSV file
 *     tags:
 *       - Ledger
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Filter by product, seller or buyer
 *     responses:
 *       200:
 *         description: CSV file (text/csv)
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *             example: "product,seller,buyer,price,createdAt,status\nPremium Widget,octocat,buyer123,29.99,2025-02-16T12:00:00.000Z,VERIFIED"
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") ?? undefined;
    const entries = await ledgerService.list(query);

    const header = ["product", "seller", "buyer", "price", "createdAt", "status"];
    const rows = entries.map((e) => [
      e.product,
      e.seller,
      e.buyer,
      String(e.price),
      e.createdAt.toISOString(),
      e.status,
    ]);
    const csv = [header, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="ledger.csv"`,
      },
    });
  } catch (error) {
    console.error("Ledger Export Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function escapeCsv(value: string) {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

