import { NextResponse } from "next/server";
import { getParentTransactions } from "@/lib/sunabar";

export const dynamic = "force-dynamic"; // キャッシュを無効化して常に最新データを取得

export async function GET() {
  try {
    // 親口座の全明細を取得する
    const allTransactions = await getParentTransactions();

    // 「任意の口座名」という言葉だけが含まれる明細にフィルタリングする
    const oshiOnly = allTransactions.filter((item: any) =>
      item.remarks.includes("推しへの想い")
    );

    // 成功時：絞り込んだ明細データをJSONで返す
    return NextResponse.json({
      success: true,
      transactions: oshiOnly,
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