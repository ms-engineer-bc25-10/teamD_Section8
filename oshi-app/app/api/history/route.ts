import { NextResponse } from "next/server";
import { getParentTransactions } from "@/lib/sunabar";

export const dynamic = "force-dynamic"; // キャッシュを無効化して常に最新データを取得

export async function GET() {
  try {
    // lib/sunabar.ts の関数を呼び出し
    const transactions = await getParentTransactions();

    // 成功時：明細データをJSONで返す
    return NextResponse.json({
      success: true,
      transactions: transactions,
    });
  } catch (error) {
    console.error("History Route Error:", error);

    // 失敗時：エラーメッセージを返す
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "明細の取得に失敗しました",
      },
      { status: 500 }
    );
  }
}