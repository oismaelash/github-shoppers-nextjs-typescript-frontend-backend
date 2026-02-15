import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/utils";
import { EnhanceSchema } from "@/dto/ai.dto";
import { DeepSeekAdapter } from "@/adapters/deepseek.adapter";

const deepSeek = new DeepSeekAdapter();

export async function POST(req: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = EnhanceSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const result = await deepSeek.enhanceContent(
            validation.data.title,
            validation.data.description
        );
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("AI Enhance Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
