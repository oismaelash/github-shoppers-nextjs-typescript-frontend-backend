import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/utils";
import { EnhanceSchema } from "@/dto/ai.dto";
import { DeepSeekAdapter } from "@/adapters/deepseek.adapter";

const deepSeek = new DeepSeekAdapter();

/**
 * @swagger
 * /api/ai/enhance:
 *   post:
 *     summary: AI enhance content
 *     description: Uses AI to improve product title and description for better e-commerce copy
 *     tags:
 *       - AI
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnhanceDTO'
 *     responses:
 *       200:
 *         description: Enhanced content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnhanceResponseDTO'
 *             example:
 *               improvedTitle: "[AI] Premium Cool Product"
 *               improvedDescription: "[AI Enhanced] A refined product description..."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
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
