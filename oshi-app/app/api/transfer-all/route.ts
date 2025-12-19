import { NextResponse } from "next/server";
import { executeDevilTransfer } from "@/lib/oshi-transfer";

export async function POST() {
  try {
    // 固定の口座IDを渡して実行（0仕込みロジックは executeDevilTransfer 内で処理）
    // チームの流儀に合わせて、ここで ID を指定します
    const result = await executeDevilTransfer({
      oshiAccountId: "SP50220961561",   // あなたが特定した子口座
      parentAccountId: "302010011594"   // あなたが特定した親口座
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("献上失敗:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}