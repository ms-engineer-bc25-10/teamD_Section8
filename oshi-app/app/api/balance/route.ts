import { NextResponse } from "next/server";
import { sunabarFetch } from "@/lib/sunabar";

const OSHIKATSU_ACCOUNT_ID = process.env.SUNABAR_OSHIKATSU_ACCOUNT_ID!;

// GET /api/balance
export async function GET() {
  try {
    const data = await sunabarFetch<{
      spAccountBalances: {
        accountId: string;
        odBalance: string; // ← 文字列なので注意
      }[];
    }>("/accounts/balances");

    // 推し活口座を accountId で特定
    const oshikatsuAccount = data.spAccountBalances.find(
      (a) => a.accountId === OSHIKATSU_ACCOUNT_ID
    );

    const balance = oshikatsuAccount ? Number(oshikatsuAccount.odBalance) : 0;

    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Balance API error:", error);
    return NextResponse.json(
      { error: "残高取得に失敗しました" },
      { status: 500 }
    );
  }
}
