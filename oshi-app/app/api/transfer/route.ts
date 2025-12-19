import { NextResponse } from "next/server";
import { sunabarFetch } from "@/lib/sunabar";

const OSHIKATSU_ACCOUNT_ID = process.env.SUNABAR_OSHIKATSU_ACCOUNT_ID!;
const PARENT_ACCOUNT_ID = process.env.SUNABAR_PARENT_ACCOUNT_ID!;

export async function POST(req: Request) {
  console.log("PARENT:", PARENT_ACCOUNT_ID);
  console.log("OSHI:", OSHIKATSU_ACCOUNT_ID);
  try {
    const { amount, rewardKey } = await req.json();

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "不正な金額です" }, { status: 400 });
    }

    console.log("reward:", rewardKey, amount);

    // ① 振替実行
    await sunabarFetch("/transfer/spaccounts-transfer", {
      method: "POST",
      body: JSON.stringify({
        debitSpAccountId: PARENT_ACCOUNT_ID, // 出金元（親）
        depositSpAccountId: OSHIKATSU_ACCOUNT_ID, // 入金先（推し活）
        currencyCode: "JPY",
        paymentAmount: amount,
      }),
    });

    // ② 最新残高を取得
    const balanceData = await sunabarFetch<{
      spAccountBalances: {
        accountId: string;
        odBalance: string;
      }[];
    }>("/accounts/balances");

    const oshikatsu = balanceData.spAccountBalances.find(
      (a) => a.accountId === OSHIKATSU_ACCOUNT_ID
    );

    return NextResponse.json({
      balance: oshikatsu ? Number(oshikatsu.odBalance) : 0,
    });
  } catch (e) {
    console.error("Transfer API error:", e);

    return NextResponse.json({ error: "振替に失敗しました" }, { status: 500 });
  }
}
