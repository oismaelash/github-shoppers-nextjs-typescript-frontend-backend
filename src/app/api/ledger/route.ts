import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LedgerService } from "@/services/ledger.service";

const ledgerService = new LedgerService();

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

