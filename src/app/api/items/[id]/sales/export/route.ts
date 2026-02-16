import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/utils";
import { SalesService } from "@/services/sales.service";

const salesService = new SalesService();

/**
 * @swagger
 * /api/items/{id}/sales/export:
 *   get:
 *     summary: Export item sales as CSV
 *     description: Downloads sales data for an item as CSV file. Only the item owner can export.
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
 *         description: CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *             example: "buyer,pricePaid,createdAt,status\noctocat,29.99,2025-02-16T12:00:00.000Z,CONFIRMED"
 *       401:
 *         description: Unauthorized
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const summary = await salesService.getSalesForItem(session.user.id, id);

  const header = ["buyer", "pricePaid", "createdAt", "status"];
  const rows = summary.sales.map((s) => [
    s.buyer,
    String(s.pricePaid),
    s.createdAt.toISOString(),
    s.status,
  ]);
  const csv = [header, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="sales-${id}.csv"`,
    },
  });
}

function escapeCsv(value: string) {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

